import { readFile } from "node:fs/promises";
import path from "node:path";

const TIPOS_POR_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

const NOMBRE_SEGURO = /^[a-f0-9-]+\.(jpg|png|webp|gif)$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ nombre: string }> }
) {
  const { nombre } = await params;
  if (!NOMBRE_SEGURO.test(nombre)) {
    return new Response(null, { status: 404 });
  }

  try {
    const contenido = await readFile(
      path.join(process.cwd(), "uploads", nombre)
    );
    const extension = nombre.split(".").pop()!.toLowerCase();
    return new Response(new Uint8Array(contenido), {
      headers: {
        "Content-Type": TIPOS_POR_EXTENSION[extension],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
