import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowUpRight, Heart, Sparkles } from "lucide-react";
import { formatoCOP, urlWhatsApp } from "@/lib/formato";
import { catalogo, imagenPortada } from "@/lib/catalogo";

export const metadata: Metadata = {
  title: "iCrochet | Regalos tejidos a mano",
  description:
    "Amigurumis y ramos tejidos personalizados, hechos a mano con amor y detalle.",
};

export default function HomePage() {
  const productosDestacados = [...catalogo]
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
    .slice(0, 3);

  return (
    <div className="overflow-hidden">
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-24">
        <div className="reveal-up max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-lila-200 bg-white/70 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-lila-700 shadow-sm backdrop-blur-sm">
            <Sparkles className="size-4" aria-hidden="true" />
            Hecho para regalar
          </div>
          <h1 className="max-w-xl text-balance text-5xl font-black leading-[0.98] tracking-[-0.055em] text-lila-900 sm:text-7xl">
            Detalles que se quedan contigo.
          </h1>
          <p className="mt-7 max-w-lg text-pretty text-lg leading-8 text-neutral-600 sm:text-xl">
            Piezas tejidas a mano para celebrar lo que hace especial cada historia: un regalo, un recuerdo o simplemente un gesto de amor.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/catalogo" className="shine inline-flex items-center gap-2 rounded-full bg-lila-700 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-lila-300/60 transition hover:-translate-y-1 hover:bg-lila-800">
              Explorar colección <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <span className="inline-flex items-center gap-2 px-3 py-3 text-sm font-bold text-lila-700">
              <Heart className="size-4 fill-rosa-200 text-lila-600" aria-hidden="true" />
              Creado con intención
            </span>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-lila-200/70 pt-6 text-sm text-neutral-600">
            <div><strong className="block text-xl font-black text-lila-900">100%</strong> hecho a mano</div>
            <div><strong className="block text-xl font-black text-lila-900">1:1</strong> atención cercana</div>
            <div><strong className="block text-xl font-black text-lila-900">∞</strong> detalles posibles</div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="float-slow relative aspect-[0.86] overflow-hidden rounded-[2rem] border-[10px] border-white bg-lila-200 shadow-2xl shadow-lila-300/70">
            <Image src={imagenPortada(productosDestacados[0] ?? catalogo[0])} alt={productosDestacados[0]?.nombre ?? "Pieza tejida a mano"} fill priority sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover transition duration-700 hover:scale-105" />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/50 bg-white/85 p-4 shadow-lg backdrop-blur-md">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-lila-600">Pieza destacada</p>
              <p className="mt-1 text-lg font-black text-lila-900">Una historia tejida para ti</p>
            </div>
          </div>
          <div className="absolute -left-3 top-10 rounded-2xl bg-rosa-100 px-4 py-3 text-sm font-black text-lila-800 shadow-lg sm:-left-8">Suave. Único. Especial.</div>
          <div className="absolute -right-3 bottom-20 rounded-2xl border border-white bg-white px-4 py-3 text-sm font-black text-lila-800 shadow-lg sm:-right-8">Personalizable</div>
        </div>
      </section>

      <section className="border-y border-white/70 bg-white/55 py-5">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-10 gap-y-3 px-4 text-center text-sm font-extrabold text-lila-700 sm:justify-between sm:px-6">
          <span>Amigurumis con alma</span><span>Ramos que no se marchitan</span><span>Regalos con significado</span>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.25em] text-lila-600">La colección</p><h2 className="mt-2 text-3xl font-black tracking-tight text-lila-900 sm:text-4xl">Pequeñas piezas, grandes emociones.</h2></div>
          <Link href="/catalogo" className="inline-flex items-center gap-1 text-sm font-extrabold text-lila-700 transition hover:gap-2">Ver todo <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
        </div>
        {productosDestacados.length > 0 ? <div className="mt-8 grid gap-5 sm:grid-cols-3">{productosDestacados.map((producto, index) => <Link key={producto.id} href={`/producto/${producto.id}`} className="reveal-up group overflow-hidden rounded-3xl border border-white/80 bg-white shadow-lg shadow-lila-200/40 transition duration-500 hover:-translate-y-2 hover:shadow-2xl" style={{ animationDelay: `${index * 100}ms` }}><div className="relative aspect-[0.95] overflow-hidden bg-lila-100"><Image src={imagenPortada(producto)} alt={producto.nombre} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" /></div><div className="flex items-center justify-between gap-3 p-5"><div><h3 className="font-black text-lila-900">{producto.nombre}</h3><p className="mt-1 line-clamp-1 text-sm text-neutral-500">{producto.descripcion}</p></div><span className="shrink-0 text-sm font-black text-lila-700">{formatoCOP.format(producto.precio)}</span></div></Link>)}</div> : <p className="mt-8 rounded-2xl border border-dashed border-lila-200 p-5 text-sm text-lila-800">Estamos preparando nuevas piezas para el catálogo.</p>}
      </section>

      <section className="mx-4 mb-16 rounded-[2rem] bg-lila-900 px-6 py-12 text-center text-white shadow-2xl shadow-lila-900/20 sm:mx-auto sm:max-w-6xl sm:px-12 sm:py-16">
        <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-rosa-200">Tu idea puede hacerse hilo</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-balance text-3xl font-black tracking-tight sm:text-5xl">Cuéntanos a quién quieres sorprender.</h2>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-lila-100">Te acompañamos a elegir colores, tamaño y detalles para crear una pieza que tenga tu historia.</p>
        <a href={urlWhatsApp("una pieza personalizada")} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-lila-800 transition hover:-translate-y-1 hover:bg-rosa-100">Hablar por WhatsApp <ArrowUpRight className="size-4" aria-hidden="true" /></a>
      </section>
    </div>
  );
}
