import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/ProductForm";
import { eliminarProducto } from "./actions";
import { formatoCOP } from "@/lib/formato";
import { imagenPortada } from "@/lib/productos";
import { requireAdminSession } from "@/lib/auth/session";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  // El panel solo existe en el equipo de administración, nunca en producción.
  if (process.env.NODE_ENV === "production") notFound();

  await requireAdminSession();

  const { edit } = await searchParams;
  const productos = await prisma.product.findMany({
    orderBy: { nombre: "asc" },
    include: { imagenes: { orderBy: { orden: "asc" } } },
  });
  const productoEnEdicion = productos.find((p) => p.id === edit) ?? null;

  return (
    <section className="mx-auto my-auto w-full max-w-6xl px-4 py-10">
      <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-lila-600">
        iCrochet
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-lila-900 sm:text-4xl">
        Panel de administración
      </h1>
      <p className="mt-2 font-medium text-neutral-500">
        Agrega, edita o elimina los productos de tu catálogo.
      </p>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[380px_1fr]">
        <div className="rounded-2xl border border-lila-100 bg-lila-50 p-6 shadow-md">
          <h2 className="mb-5 text-xl font-extrabold text-lila-800">
            {productoEnEdicion
              ? `Editando: ${productoEnEdicion.nombre}`
              : "Nuevo producto"}
          </h2>
          <ProductForm producto={productoEnEdicion} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-lila-800">
            Productos ({productos.length})
          </h2>
          {productos.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-lila-200 bg-white p-10 text-center font-semibold text-neutral-400 shadow-md">
              Aún no hay productos. Crea el primero con el formulario.
            </p>
          ) : (
            productos.map((producto) => (
              <div
                key={producto.id}
                className={`flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-md ring-1 transition sm:flex-row sm:items-center ${
                  productoEnEdicion?.id === producto.id
                    ? "ring-2 ring-lila-400"
                    : "ring-lila-100"
                }`}
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-lila-50">
                  <Image
                    src={imagenPortada(producto)}
                    alt={producto.nombre}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-extrabold text-neutral-800">
                    {producto.nombre}
                  </h3>
                  <p className="truncate text-sm text-neutral-500">
                    {producto.descripcion}
                  </p>
                  <span className="text-sm font-extrabold text-lila-600">
                    {formatoCOP.format(producto.precio)}
                  </span>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/producto/${producto.id}`}
                    className="rounded-xl bg-lila-50 px-4 py-2 text-sm font-bold text-lila-600 transition hover:bg-lila-100"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/admin?edit=${producto.id}`}
                    className="rounded-xl bg-lila-100 px-4 py-2 text-sm font-bold text-lila-700 transition hover:bg-lila-200"
                  >
                    Editar
                  </Link>
                  <form action={eliminarProducto}>
                    <input type="hidden" name="id" value={producto.id} />
                    <button
                      type="submit"
                      className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-500 transition hover:bg-red-100"
                    >
                      Eliminar
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
