"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { exportarCatalogo } from "@/lib/catalogo-exportar";
import {
  borrarArchivo,
  borrarArchivos,
  esImagenValida,
  guardarImagenes,
} from "@/lib/storage";

function refrescar() {
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/admin");
}

function extraerDatos(formData: FormData) {
  return {
    nombre: String(formData.get("nombre") ?? "").trim(),
    descripcion: String(formData.get("descripcion") ?? "").trim(),
    precio: Number(formData.get("precio")),
  };
}

function sonValidos(datos: {
  nombre: string;
  descripcion: string;
  precio: number;
}) {
  return (
    datos.nombre.length > 0 &&
    datos.descripcion.length > 0 &&
    Number.isInteger(datos.precio) &&
    datos.precio > 0
  );
}

function archivosValidosDe(formData: FormData): File[] {
  return formData
    .getAll("imagenes")
    .filter(
      (valor): valor is File => valor instanceof File && esImagenValida(valor)
    );
}

export async function crearProducto(formData: FormData) {
  // El panel solo existe en el equipo de administracion, nunca en produccion.
  if (process.env.NODE_ENV === "production") return;

  await requireAdminSession();

  const datos = extraerDatos(formData);
  if (!sonValidos(datos)) return;

  const archivos = archivosValidosDe(formData);
  if (archivos.length === 0) return;

  const urls = await guardarImagenes(archivos);
  if (urls.length === 0) return;

  try {
    await prisma.product.create({
      data: {
        ...datos,
        precio: Math.round(datos.precio),
        imagenes: {
          create: urls.map((url, orden) => ({ url, orden })),
        },
      },
    });
  } catch {
    await borrarArchivos(urls);
    return;
  }

  await exportarCatalogo();
  refrescar();
  redirect("/admin");
}

export async function actualizarProducto(formData: FormData) {
  // El panel solo existe en el equipo de administracion, nunca en produccion.
  if (process.env.NODE_ENV === "production") return;

  await requireAdminSession();

  const id = String(formData.get("id") ?? "");
  const datos = extraerDatos(formData);
  if (!id || !sonValidos(datos)) return;

  const producto = await prisma.product.findUnique({
    where: { id },
    include: { imagenes: true },
  });
  if (!producto) return;

  const nuevasUrls = await guardarImagenes(
    archivosValidosDe(formData),
    producto.imagenes.length
  );

  await prisma.$transaction([
    prisma.product.update({
      where: { id },
      data: { ...datos, precio: Math.round(datos.precio) },
    }),
    ...(nuevasUrls.length
      ? [
          prisma.imagenProducto.createMany({
            data: nuevasUrls.map((url, indice) => ({
              url,
              orden: producto.imagenes.length + indice,
              productoId: id,
            })),
          }),
        ]
      : []),
  ]);

  await exportarCatalogo();
  refrescar();
  redirect("/admin");
}

export async function eliminarImagenProducto(formData: FormData) {
  // El panel solo existe en el equipo de administracion, nunca en produccion.
  if (process.env.NODE_ENV === "production") return;

  await requireAdminSession();

  const imagenId = String(formData.get("imagenId") ?? "");
  if (!imagenId) return;

  const imagen = await prisma.imagenProducto.findUnique({
    where: { id: imagenId },
  });
  if (!imagen) return;

  const total = await prisma.imagenProducto.count({
    where: { productoId: imagen.productoId },
  });
  if (total <= 1) return;

  await prisma.imagenProducto.delete({ where: { id: imagen.id } });
  await borrarArchivo(imagen.url);

  await exportarCatalogo();
  refrescar();
}

export async function eliminarProducto(formData: FormData) {
  // El panel solo existe en el equipo de administracion, nunca en produccion.
  if (process.env.NODE_ENV === "production") return;

  await requireAdminSession();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const producto = await prisma.product.findUnique({
    where: { id },
    include: { imagenes: true },
  });
  if (!producto) return;

  await prisma.product.delete({ where: { id } });
  await borrarArchivos(producto.imagenes.map((imagen) => imagen.url));

  await exportarCatalogo();
  refrescar();
}
