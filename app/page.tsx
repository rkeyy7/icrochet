import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Heart, MessageCircle, Sparkles } from "lucide-react";
import { formatoCOP, urlWhatsApp } from "@/lib/formato";
import { catalogo, imagenPortada } from "@/lib/catalogo";

export const metadata: Metadata = {
  title: "iCrochet | Detalles que se quedan para siempre",
  description: "Amigurumis y ramos tejidos a mano para regalar momentos únicos.",
};

export default function HomePage() {
  const destacados = [...catalogo].sort((a, b) => a.nombre.localeCompare(b.nombre, "es")).slice(0, 3);
  const protagonista = destacados[0] ?? catalogo[0];

  return (
    <div className="overflow-hidden">
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:pb-28 lg:pt-20">
        <div className="reveal-up max-w-xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-lila-200 bg-white/70 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-lila-700 shadow-sm">
            <Sparkles className="size-4" aria-hidden="true" /> Hecho para regalar
          </div>
          <h1 className="text-balance text-5xl font-black leading-[0.98] tracking-tight text-lila-900 sm:text-7xl">
            Regalos con alma, <span className="text-lila-500">tejidos a mano.</span>
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-neutral-600">
            Piezas únicas para celebrar lo que importa. Creamos amigurumis y ramos personalizados con paciencia, ternura y mucho detalle.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/catalogo" className="shine inline-flex items-center gap-2 rounded-full bg-lila-700 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-lila-300/50 transition hover:-translate-y-1 hover:bg-lila-800">
              Explorar colección <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a href={urlWhatsApp("mi regalo personalizado")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-lila-300 bg-white/60 px-5 py-3.5 text-sm font-extrabold text-lila-800 transition hover:bg-white">
              <MessageCircle className="size-4" aria-hidden="true" /> Hablar con nosotros
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-bold text-lila-800">
            {["Diseños personalizados", "Atención cercana", "Envíos desde Cartagena"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2"><Check className="size-4 text-lila-500" aria-hidden="true" />{item}</span>
            ))}
          </div>
        </div>

        {protagonista ? (
          <div className="reveal-up relative mx-auto w-full max-w-xl lg:justify-self-end" style={{ animationDelay: "140ms" }}>
            <div className="absolute -left-5 top-12 z-10 hidden -rotate-6 rounded-2xl bg-rosa-100 px-4 py-3 text-sm font-black text-lila-800 shadow-lg sm:block">Una puntada<br />a la vez</div>
            <div className="float-slow relative aspect-[0.9] overflow-hidden rounded-[2rem] border-8 border-white bg-lila-100 shadow-2xl shadow-lila-300/50">
              <Image src={imagenPortada(protagonista)} alt={protagonista.nombre} fill priority sizes="(max-width: 1024px) 90vw, 50vw" className="object-cover transition duration-700 hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-lila-900/80 via-lila-900/20 to-transparent p-6 pt-24 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-rosa-200">Pieza destacada</p>
                <p className="mt-1 text-2xl font-black">{protagonista.nombre}</p>
                <p className="mt-1 font-bold text-white/80">{formatoCOP.format(protagonista.precio)}</p>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-3 flex items-center gap-3 rounded-2xl border border-white bg-white px-4 py-3 shadow-xl sm:right-4"><Heart className="size-5 fill-rosa-200 text-lila-600" aria-hidden="true" /><span className="text-sm font-extrabold text-lila-900">Hecho con cariño</span></div>
          </div>
        ) : null}
      </section>

      <section className="border-y border-lila-200/70 bg-white/55">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:grid-cols-3 sm:px-8">
          {[ ["+100%", "hecho a mano"], ["1:1", "atención personalizada"], ["∞", "detalles para recordar"] ].map(([value, label]) => <div key={label} className="flex items-center gap-4 sm:justify-center"><span className="text-3xl font-black text-lila-600">{value}</span><span className="max-w-24 text-sm font-bold leading-5 text-neutral-600">{label}</span></div>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-extrabold uppercase tracking-[0.3em] text-lila-600">La colección</p><h2 className="mt-3 text-3xl font-black text-lila-900 sm:text-5xl">Pequeñas piezas,<br /><span className="text-lila-500">grandes historias.</span></h2></div><Link href="/catalogo" className="inline-flex items-center gap-2 text-sm font-extrabold text-lila-700 hover:text-lila-900">Ver todo <ArrowRight className="size-4" aria-hidden="true" /></Link></div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">{destacados.map((producto, index) => <Link key={producto.id} href={`/producto/${producto.id}`} className={`group reveal-up ${index === 1 ? "md:translate-y-8" : ""}`} style={{ animationDelay: `${index * 100}ms` }}><div className="relative aspect-[0.88] overflow-hidden rounded-[1.5rem] bg-lila-100"><Image src={imagenPortada(producto)} alt={producto.nombre} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" /></div><div className="flex items-start justify-between gap-4 pt-4"><div><h3 className="text-lg font-black text-lila-900">{producto.nombre}</h3><p className="mt-1 line-clamp-1 text-sm text-neutral-500">{producto.descripcion}</p></div><p className="shrink-0 font-black text-lila-700">{formatoCOP.format(producto.precio)}</p></div></Link>)}</div>
      </section>

      <section className="mx-5 mb-16 overflow-hidden rounded-[2rem] bg-lila-800 px-6 py-14 text-center text-white shadow-2xl shadow-lila-300/40 sm:mx-8 sm:px-12 lg:mx-auto lg:max-w-7xl"><p className="text-xs font-extrabold uppercase tracking-[0.3em] text-rosa-200">Tu idea puede convertirse en hilo</p><h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black text-balance sm:text-5xl">Cuéntanos a quién quieres sorprender.</h2><p className="mx-auto mt-5 max-w-xl leading-7 text-white/75">Te ayudamos a elegir o crear ese detalle que no se encuentra en cualquier lugar.</p><a href={urlWhatsApp("un regalo especial")} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-rosa-100 px-6 py-3.5 text-sm font-extrabold text-lila-900 transition hover:-translate-y-1 hover:bg-white"><MessageCircle className="size-4" aria-hidden="true" /> Diseñar mi regalo</a></section>
    </div>
  );
}
