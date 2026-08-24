import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import type { ProductoCatalogo } from "@/lib/catalogo";

function rutaUploads(): string {
  return path.join(process.cwd(), "uploads");
}

function nombreSeguro(url: string): string | null {
  const nombre = url.slice("/uploads/".length);
  if (
    !nombre ||
    nombre.includes("/") ||
    nombre.includes("\\") ||
    nombre.includes("..")
  ) {
    return null;
  }
  return nombre;
}

/**
 * Genera data/catalogo.json y copia las fotos subidas a public/productos/<id>/.
 * Ese par (JSON + fotos) es lo que viaja en el repositorio y se publica en
 * producción: la app pública nunca toca la base de datos.
 */
export async function exportarCatalogo(): Promise<void> {
  const productos = await prisma.product.findMany({
    orderBy: { nombre: "asc" },
    include: { imagenes: { orderBy: { orden: "asc" } } },
  });

  const exportados: ProductoCatalogo[] = [];

  for (const producto of productos) {
    const imagenes: string[] = [];

    for (const imagen of producto.imagenes) {
      if (!imagen.url.startsWith("/uploads/")) {
        // Imágenes fijas del proyecto (ej. /img/*.svg)
        imagenes.push(imagen.url);
        continue;
      }

      const nombre = nombreSeguro(imagen.url);
      if (!nombre) continue;

      try {
        const destino = path.join(
          process.cwd(),
          "public",
          "productos",
          producto.id
        );
        await mkdir(destino, { recursive: true });
        await copyFile(path.join(rutaUploads(), nombre), path.join(destino, nombre));
        imagenes.push(`/productos/${producto.id}/${nombre}`);
      } catch {
        // El archivo ya no está en uploads; se omite la imagen.
      }
    }

    exportados.push({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      imagenes,
    });
  }

  const destinoJson = path.join(process.cwd(), "data", "catalogo.json");
  await mkdir(path.dirname(destinoJson), { recursive: true });
  await writeFile(destinoJson, `${JSON.stringify(exportados, null, 2)}\n`, "utf8");
}
