import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, "dev.db"));

const productos = [
  {
    id: "cj-conejita-luna-001",
    nombre: "Conejita Luna",
    descripcion:
      "Amigurumi tejido a mano en hilo algodón suave. La compañera perfecta para dormir y decorar. Aprox. 20 cm de alto.",
    precio: 45000,
    imagenes: ["/img/conejita-luna.svg"],
  },
  {
    id: "cj-osito-miel-002",
    nombre: "Osito Miel",
    descripcion:
      "Tierno osito amigurumi color miel, tejido punto a punto con mucho amor. Ideal para regalar. Aprox. 18 cm.",
    precio: 42000,
    imagenes: ["/img/osito-miel.svg"],
  },
  {
    id: "cj-ramo-tulipanes-003",
    nombre: "Ramo de Tulipanes Eternos",
    descripcion:
      "Ramo de 7 tulipanes tejidos que nunca se marchitan. Colores personalizables según tu ocasión especial.",
    precio: 68000,
    imagenes: ["/img/ramo-tulipanes.svg"],
  },
];

db.exec(
  `CREATE TABLE IF NOT EXISTS "Product" (
     "id" TEXT PRIMARY KEY,
     "nombre" TEXT NOT NULL,
     "descripcion" TEXT NOT NULL,
     "precio" INTEGER NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS "ImagenProducto" (
     "id" TEXT PRIMARY KEY,
     "url" TEXT NOT NULL,
     "orden" INTEGER NOT NULL DEFAULT 0,
     "productoId" TEXT NOT NULL,
     CONSTRAINT "ImagenProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
   )`,
  `CREATE INDEX IF NOT EXISTS "ImagenProducto_productoId_idx" ON "ImagenProducto"("productoId")`
);

const insertarProducto = db.prepare(
  `INSERT INTO "Product" ("id", "nombre", "descripcion", "precio")
   VALUES (@id, @nombre, @descripcion, @precio)
   ON CONFLICT("id") DO NOTHING`
);

const insertarImagen = db.prepare(
  `INSERT INTO "ImagenProducto" ("id", "url", "orden", "productoId")
   VALUES (@id, @url, @orden, @productoId)
   ON CONFLICT("id") DO NOTHING`
);

const insertarTodo = db.transaction((lista) => {
  for (const p of lista) {
    const resultado = insertarProducto.run(p);
    // Solo agrega imágenes si el producto es nuevo; nunca duplica en existentes.
    if (resultado.changes > 0) {
      p.imagenes.forEach((url, orden) => {
        insertarImagen.run({
          id: `${p.id}-img-${orden}`,
          url,
          orden,
          productoId: p.id,
        });
      });
    }
  }
});

insertarTodo(productos);

// Regenera el snapshot público data/catalogo.json
import { mkdirSync, writeFileSync } from "node:fs";

const imagenesDe = db.prepare(
  `SELECT url FROM "ImagenProducto" WHERE "productoId" = ? ORDER BY "orden" ASC`
);

const catalogoPublico = [...productos]
  .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
  .map((p) => ({
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    imagenes: imagenesDe.all(p.id).map((fila) => fila.url),
  }));

mkdirSync(path.join(__dirname, "..", "data"), { recursive: true });
writeFileSync(
  path.join(__dirname, "..", "data", "catalogo.json"),
  `${JSON.stringify(catalogoPublico, null, 2)}\n`
);

const total = db.prepare('SELECT COUNT(*) AS total FROM "Product"').get();
console.log(`Seed completado. Productos en la base de datos: ${total.total}`);

db.close();
