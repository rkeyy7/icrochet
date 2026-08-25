import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GaleriaProducto from "@/components/GaleriaProducto";
import ProductCard from "@/components/ProductCard";
import { formatoCOP, urlWhatsApp } from "@/lib/formato";
import { catalogo, imagenPortada, obtenerProductoCatalogo } from "@/lib/catalogo";

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
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-7 sm:px-6 sm:pb-24 sm:pt-10">
      <Link href="/catalogo" className="reveal-up group inline-flex items-center gap-3 text-sm font-extrabold text-lila-700 transition hover:text-lila-900">
        <span className="flex size-9 items-center justify-center rounded-full border border-lila-200 bg-white/75 text-lg shadow-sm transition group-hover:-translate-x-1 group-hover:bg-lila-100" aria-hidden>←</span>
        Volver al catálogo
      </Link>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1.03fr)_minmax(22rem,.8fr)] lg:gap-14">
        <GaleriaProducto imagenes={producto.imagenes} nombre={producto.nombre} />

        <div className="reveal-up lg:sticky lg:top-8">
          <div className="mb-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-lila-600">
            <span className="h-px w-8 bg-lila-400" /> Pieza de autor
          </div>
          <div className="rounded-[2rem] border border-white/80 bg-white/90 p-7 shadow-[0_24px_70px_-30px_rgba(91,60,94,.45)] sm:p-9">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-lila-100 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-lila-700">Hecho a mano</span>
              <span className="rounded-full bg-rosa-100 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-lila-700">Personalizable</span>
            </div>
            <h1 className="mt-5 text-balance text-4xl font-black leading-[1.05] text-lila-900 sm:text-5xl">{producto.nombre}</h1>
            <p className="mt-5 text-3xl font-black text-lila-600">{formatoCOP.format(producto.precio)}</p>
            <div className="my-7 h-px bg-lila-100" />
            <p className="whitespace-pre-line leading-7 text-neutral-600">{producto.descripcion}</p>
            <a href={urlWhatsApp(producto.nombre)} target="_blank" rel="noopener noreferrer" className="shine mt-8 flex items-center justify-center rounded-2xl bg-lila-700 px-6 py-4 text-center font-black text-white shadow-lg shadow-lila-300/50 transition hover:-translate-y-0.5 hover:bg-lila-800 active:translate-y-0">Encargar por WhatsApp <span className="ml-2" aria-hidden>↗</span></a>
            <p className="mt-4 text-center text-sm font-semibold leading-6 text-neutral-400">Coordina colores, tamaño y entrega directamente con nosotras.</p>
          </div>
          <p className="mt-5 text-center text-xs font-extrabold uppercase tracking-[0.18em] text-lila-500">Un detalle hecho especialmente para ti</p>
        </div>
      </div>

      {relacionados.length > 0 && (
        <div className="mt-20 border-t border-lila-200/70 pt-10 sm:mt-28">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-xs font-black uppercase tracking-[0.2em] text-lila-600">Para completar tu elección</p><h2 className="mt-2 text-3xl font-black text-lila-900">También te puede gustar</h2></div>
            <Link href="/catalogo" className="hidden text-sm font-extrabold text-lila-700 transition hover:text-lila-900 sm:block">Ver todo →</Link>
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-3">{relacionados.map((relacionado, index) => <ProductCard key={relacionado.id} producto={relacionado} index={index} />)}</div>
        </div>
      )}
    </section>
  );
}
