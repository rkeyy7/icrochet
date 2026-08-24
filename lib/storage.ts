import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  MAX_BYTES_POR_FOTO,
  MAX_FOTOS_POR_PRODUCTO,
} from "@/lib/productos";

const EXTENSIONES_POR_TIPO: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export function esImagenValida(archivo: File): boolean {
  return (
    archivo.size > 0 &&
    archivo.size <= MAX_BYTES_POR_FOTO &&
    archivo.type in EXTENSIONES_POR_TIPO
  );
}

function rutaUploads(): string {
  return path.join(process.cwd(), "uploads");
}

async function escribirArchivo(archivo: File): Promise<string> {
  await mkdir(rutaUploads(), { recursive: true });
  const extension = EXTENSIONES_POR_TIPO[archivo.type];
  const nombre = `${randomUUID()}${extension}`;
  const buffer = Buffer.from(await archivo.arrayBuffer());
  await writeFile(path.join(rutaUploads(), nombre), buffer);
  return `/uploads/${nombre}`;
}

export async function guardarImagenes(
  archivosValidos: File[],
  cantidadActual = 0
): Promise<string[]> {
  const cupo = Math.max(MAX_FOTOS_POR_PRODUCTO - cantidadActual, 0);
  const seleccionadas = archivosValidos.slice(0, cupo);
  return Promise.all(seleccionadas.map(escribirArchivo));
}

export async function borrarArchivo(url: string): Promise<void> {
  if (!url.startsWith("/uploads/")) return;
  const nombre = url.slice("/uploads/".length);
  if (
    !nombre ||
    nombre.includes("/") ||
    nombre.includes("\\") ||
    nombre.includes("..")
  ) {
    return;
  }
  try {
    await unlink(path.join(rutaUploads(), nombre));
  } catch {
    // El archivo ya no existe o no se puede borrar; se ignora.
  }
}

export async function borrarArchivos(urls: string[]): Promise<void> {
  await Promise.all(urls.map(borrarArchivo));
}
