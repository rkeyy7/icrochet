import type { ImagenProducto, Product } from "@/lib/generated/prisma/client";

export type ProductoConImagenes = Product & {
  imagenes: ImagenProducto[];
};

export const MAX_FOTOS_POR_PRODUCTO = 6;
export const MAX_BYTES_POR_FOTO = 4 * 1024 * 1024;

export const ETIQUETA_REGLAS_FOTOS =
  "JPG, PNG, WEBP o GIF · máximo 4MB por foto";

const IMAGEN_PLACEHOLDER = "/img/conejita-luna.svg";

export function imagenPortada(producto: {
  imagenes: Pick<ImagenProducto, "url" | "orden">[];
}): string {
  return producto.imagenes[0]?.url ?? IMAGEN_PLACEHOLDER;
}
