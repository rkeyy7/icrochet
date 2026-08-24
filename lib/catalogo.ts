import catalogoJson from "@/data/catalogo.json";

export type ProductoCatalogo = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenes: string[];
};

export const catalogo: ProductoCatalogo[] = catalogoJson;

const IMAGEN_PLACEHOLDER = "/img/conejita-luna.svg";

export function imagenPortada(producto: ProductoCatalogo): string {
  return producto.imagenes[0] ?? IMAGEN_PLACEHOLDER;
}

export function obtenerProductoCatalogo(id: string): ProductoCatalogo | null {
  return catalogo.find((producto) => producto.id === id) ?? null;
}
