import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GaleriaProducto from "@/components/GaleriaProducto";
import ProductCard from "@/components/ProductCard";
import { formatoCOP, urlWhatsApp } from "@/lib/formato";
import {
  catalogo,
  imagenPortada,
  obtenerProductoCatalogo,
} from "@/lib/catalogo";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return catalogo.map((producto) => ({ id: producto.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const producto = obtenerProductoCatalogo(id);
  if (!producto) return { title: "Producto no encontrado | iCrochet" };

  return {
    title: `${producto.nombre} | iCrochet`,
    description: producto.descripcion,
    openGraph: {
      title: `${producto.nombre} | iCrochet`,
      description: producto.descripcion,
      images: [{ url: imagenPortada(producto) }],
    },
  };
}

export default async function ProductoPage({ params }: Props) {
  const { id } = await params;
  const producto = obtenerProductoCatalogo(id);
  if (!producto) notFound();

  const relacionados = [...catalogo]
    .filter((candidato) => candidato.id !== producto.id)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
    .slice(0, 3);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-12">
      <Link
        href="/catalogo"
        className="reveal-up inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold text-lila-700 shadow-sm ring-1 ring-lila-100 transition hover:bg-lila-100"
      >
        <span aria-hidden>←</span> Volver al catálogo
      </Link>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-10">
        <GaleriaProducto imagenes={producto.imagenes} nombre={producto.nombre} />

        <div className="reveal-up rounded-3xl border border-white/70 bg-white/85 p-6 shadow-xl shadow-lila-200/50 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-lila-200 bg-lila-50 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.15em] text-lila-700">
              Hecho a mano
            </span>
            <span className="rounded-full border border-lila-200 bg-lila-50 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.15em] text-lila-700">
              Personalizable
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-black text-lila-900 sm:text-4xl">
            {producto.nombre}
          </h1>
          <p className="mt-3 text-3xl font-black text-lila-600">
            {formatoCOP.format(producto.precio)}
          </p>

          <div className="my-6 h-px bg-gradient-to-r from-transparent via-lila-200 to-transparent" />

          <p className="whitespace-pre-line leading-relaxed text-neutral-600">
            {producto.descripcion}
          </p>

          <a
            href={urlWhatsApp(producto.nombre)}
            target="_blank"
            rel="noopener noreferrer"
            className="shine mt-7 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-lila-500 to-lila-700 px-6 py-4 text-center font-bold text-white shadow-lg shadow-lila-300/50 transition hover:scale-[1.01] hover:from-lila-600 hover:to-lila-800 active:scale-[0.98]"
          >
            Encargar por WhatsApp
          </a>
          <p className="mt-3 text-center text-sm font-semibold text-neutral-400">
            Coordina colores, tamaño y entrega directamente con nosotras.
          </p>
        </div>
      </div>

      {relacionados.length > 0 && (
        <div className="mt-14">
          <h2 className="text-2xl font-black text-lila-900">
            También te puede gustar
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {relacionados.map((relacionado, index) => (
              <ProductCard
                key={relacionado.id}
                producto={relacionado}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
