import Database from "better-sqlite3";
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const CARPETA_ORIGEN = path.join(process.cwd(), "ramos_Amigurumis");
const CARPETA_UPLOADS = path.join(process.cwd(), "uploads");
const EXTENSIONES = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

// ── Utilidades de limpieza ────────────────────────────────────────────────

function sinEmojis(texto) {
  let resultado = "";
  for (const caracter of texto) {
    if (/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/u.test(caracter)) continue;
    resultado += caracter;
  }
  return resultado;
}

function normalizarEspacios(texto) {
  return texto.replace(/\s+/g, " ").trim();
}

function nombreBase(archivo) {
  // Todo lo que va ANTES del marcador de precio
  const coincidenciaPrecio = archivo.match(/COP\s*[\d.,]+/i);
  const base = coincidenciaPrecio ? archivo.slice(0, coincidenciaPrecio.index) : archivo;
  return normalizarEspacios(
    base
      .replace(/\s*foto\s*(\d+)?\s*/gi, " ") // quita marcadores foto1/foto 2/fotoN
      .replace(/[_-]+/g, " ")
  );
}

function claveGrupo(nombreBase) {
  return normalizarEspacios(sinEmojis(nombreBase)).toLowerCase();
}

function nombreParaMostrar(nombreBase) {
  let nombre = normalizarEspacios(sinEmojis(nombreBase))
    .replace(/^amigurimis\b/i, "Amigurumi")
    .replace(/^amigurumis\b/i, "Amigurumi")
    .replace(/^amigurumi\b/i, "Amigurumi")
    .replace(/^bouquet\b/i, "Bouquet");
  nombre = normalizarEspacios(nombre);
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

function extraerPrecio(archivo) {
  const coincidencia = archivo.match(/COP\s*([\d.,]+)/i);
  if (!coincidencia) return null;
  const precio = Number(coincidencia[1].replace(/[.,]/g, ""));
  return Number.isInteger(precio) && precio > 0 ? precio : null;
}

function numeroFoto(archivo) {
  const coincidencia = archivo.match(/foto\s*(\d+)?/i);
  if (!coincidencia) return 0;
  return coincidencia[1] ? Number(coincidencia[1]) : 1;
}

// ── Descripciones artesanales ─────────────────────────────────────────────

function generarDescripcion(nombre, esAmigurumi) {
  if (esAmigurumi) {
    return `${nombre}, tejido a mano al crochet punto a punto con hilo suave y mucho amor. Pieza única con acabados cuidados, perfecta para regalar o decorar. Colores y detalles personalizables según tu ocasión especial.`;
  }

  const cantidad = nombre.match(/(\d+)\s+(rosas|tulipanes|girasoles)/i)
    ?? nombre.match(/\b(una|un)\s+(rosa|tulipán|girasol)\b/i);

  if (cantidad) {
    const flores = cantidad[0].replace(/^de\s+/i, "").toLowerCase();
    return `Ramo tejido a mano con ${flores} que nunca se marchitan. Cada flor es única, con acabados cuidados y colores personalizables según tu ocasión especial.`;
  }

  return "Ramo tejido a mano al crochet con flores eternas que nunca se marchitan. Combinaciones y colores personalizables según tu ocasión especial.";
}

// ── Agrupación de archivos en productos ───────────────────────────────────

if (!existsSync(CARPETA_ORIGEN)) {
  console.error(`No existe la carpeta ${CARPETA_ORIGEN}`);
  process.exit(1);
}

const grupos = new Map();

for (const entrada of readdirSync(CARPETA_ORIGEN)) {
  const extension = path.extname(entrada).toLowerCase();
  if (!EXTENSIONES.has(extension)) continue;
  if (!statSync(path.join(CARPETA_ORIGEN, entrada)).isFile()) continue;

  const base = nombreBase(entrada);
  const clave = claveGrupo(base);
  if (!grupos.has(clave)) grupos.set(clave, []);
  grupos.get(clave).push({
    archivo: entrada,
    orden: numeroFoto(entrada),
    extension,
  });
}

const productos = [...grupos.values()].map((fotos) => {
  fotos.sort((a, b) => a.orden - b.orden || a.archivo.localeCompare(b.archivo));
  const referencia = fotos[0].archivo;
  const base = nombreBase(referencia);
  const nombre = nombreParaMostrar(base);
  const precio = extraerPrecio(referencia);
  const esAmigurumi = /amigurum/i.test(base);
  return { nombre, precio, descripcion: generarDescripcion(nombre, esAmigurumi), fotos };
});

productos.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

const sinPrecio = productos.filter((p) => p.precio === null);
if (sinPrecio.length > 0) {
  console.error("Productos sin precio legible:", sinPrecio.map((p) => p.nombre));
  process.exit(1);
}

// ── Escritura en la base de datos ─────────────────────────────────────────

const db = new Database(path.join(process.cwd(), "prisma", "dev.db"));

const existentes = db
  .prepare(`SELECT lower(nombre) AS clave, precio FROM Product`)
  .all()
  .map((fila) => `${fila.clave}|${fila.precio}`);

const insertarProducto = db.prepare(
  `INSERT INTO "Product" ("id", "nombre", "descripcion", "precio") VALUES (?, ?, ?, ?)`
);
const insertarImagen = db.prepare(
  `INSERT INTO "ImagenProducto" ("id", "url", "orden", "productoId") VALUES (?, ?, ?, ?)`
);

mkdirSync(CARPETA_UPLOADS, { recursive: true });

let creados = 0;
let omitidos = 0;

const importarTodo = db.transaction(() => {
  for (const producto of productos) {
    const huella = `${producto.nombre.toLowerCase()}|${producto.precio}`;
    if (existentes.includes(huella)) {
      console.log(`↷ Omitido (ya existe): ${producto.nombre}`);
      omitidos++;
      continue;
    }

    const id = `c${Date.now().toString(36)}${randomUUID().replaceAll("-", "").slice(0, 12)}`;
    insertarProducto.run(id, producto.nombre, producto.descripcion, producto.precio);

    producto.fotos.forEach((foto, orden) => {
      const nombreArchivo = `${randomUUID()}${foto.extension}`;
      copyFileSync(path.join(CARPETA_ORIGEN, foto.archivo), path.join(CARPETA_UPLOADS, nombreArchivo));
      insertarImagen.run(`${id}-img-${orden}`, `/uploads/${nombreArchivo}`, orden, id);
    });

    console.log(`✔ ${producto.nombre} — $${producto.precio.toLocaleString("es-CO")} (${producto.fotos.length} foto${producto.fotos.length > 1 ? "s" : ""})`);
    creados++;
  }
});

importarTodo(db);
db.close();

console.log("");
console.log(`Importados: ${creados} · Omitidos por duplicado: ${omitidos}`);

// ── Regenerar snapshot público (data/catalogo.json + public/productos) ────

const db2 = new Database(path.join(process.cwd(), "prisma", "dev.db"));
const filas = db2.prepare(`SELECT id, nombre, descripcion, precio FROM Product ORDER BY nombre ASC`).all();
const imagenesDe = db2.prepare(`SELECT url FROM ImagenProducto WHERE productoId = ? ORDER BY orden ASC`);

const catalogo = [];
for (const producto of filas) {
  const imagenes = [];
  for (const { url } of imagenesDe.all(producto.id)) {
    if (!url.startsWith("/uploads/")) {
      imagenes.push(url);
      continue;
    }
    const destinoDir = path.join("public", "productos", producto.id);
    mkdirSync(destinoDir, { recursive: true });
    try {
      copyFileSync(path.join("uploads", path.basename(url)), path.join(destinoDir, path.basename(url)));
      imagenes.push(`/productos/${producto.id}/${path.basename(url)}`);
    } catch {
      imagenes.push(url);
    }
  }
  catalogo.push({ ...producto, imagenes });
}

mkdirSync(path.join(process.cwd(), "data"), { recursive: true });
writeFileSync(
  path.join(process.cwd(), "data", "catalogo.json"),
  `${JSON.stringify(catalogo, null, 2)}\n`
);
db2.close();

console.log(`Snapshot regenerado: ${catalogo.length} productos en data/catalogo.json`);
