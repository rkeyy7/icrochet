import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { formatoCOP } from "@/lib/formato";
import { catalogo, imagenPortada } from "@/lib/catalogo";

export const metadata: Metadata = {
  title: "iCrochet | Regalos Tejidos a Mano",
  description:
    "Landing oficial de iCrochet: amigurumis y ramos tejidos personalizados, hechos a mano con amor y detalle.",
  openGraph: {
    title: "iCrochet | Regalos Tejidos a Mano",
    description:
      "Descubre piezas tejidas personalizadas para regalar momentos inolvidables.",
    type: "website",
    locale: "es_CO",
  },
};

export default async function HomePage() {
  const productosDestacados = [...catalogo]
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
    .slice(0, 3);
  const totalProductos = catalogo.length;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <div className="relative overflow-hidden rounded-[2.25rem] border border-white/50 bg-gradient-to-br from-lila-100/90 via-white to-[#ffe7ef] p-8 shadow-2xl shadow-lila-200/70 sm:p-12">
        <div className="float-slow pointer-events-none absolute -left-14 top-8 h-36 w-36 rounded-full bg-[#ffd5e6]/70 blur-3xl" />
        <div className="float-slow pointer-events-none absolute -right-16 bottom-0 h-44 w-44 rounded-full bg-lila-200/70 blur-3xl" style={{ animationDelay: "400ms" }} />

        <p className="reveal-up text-xs font-extrabold uppercase tracking-[0.3em] text-lila-700" style={{ animationDelay: "80ms" }}>
          Colección artesanal
        </p>
        <h1 className="reveal-up mt-3 max-w-3xl text-4xl font-black text-lila-900 sm:text-6xl" style={{ animationDelay: "140ms" }}>
          Amigurumis y ramos tejidos que convierten momentos en recuerdos
        </h1>
        <p className="reveal-up mt-4 max-w-2xl text-lg font-medium text-neutral-600" style={{ animationDelay: "220ms" }}>
          Diseños hechos a mano, personalizados y llenos de detalle. Descubre el catálogo y encarga una pieza única para ti o para regalar.
        </p>

        <div className="reveal-up mt-7 flex flex-wrap gap-3" style={{ animationDelay: "280ms" }}>
          <span className="rounded-full border border-lila-200 bg-white/75 px-4 py-2 text-sm font-bold text-lila-700">Diseños personalizados</span>
          <span className="rounded-full border border-lila-200 bg-white/75 px-4 py-2 text-sm font-bold text-lila-700">Acabado premium</span>
          <span className="rounded-full border border-lila-200 bg-white/75 px-4 py-2 text-sm font-bold text-lila-700">Atención por WhatsApp</span>
        </div>

        <div className="reveal-up mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "340ms" }}>
          <Link
            href="/catalogo"
            className="shine rounded-2xl bg-lila-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-lila-300/70 transition hover:-translate-y-0.5 hover:bg-lila-700"
          >
            Ver catálogo
          </Link>
          <span className="text-sm font-semibold text-neutral-600">Entrega con amor en cada puntada</span>
        </div>

        <div className="reveal-up mt-8 grid gap-3 sm:grid-cols-3" style={{ animationDelay: "420ms" }}>
          <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lila-700">Piezas activas</p>
            <p className="mt-1 text-2xl font-black text-lila-900">{totalProductos}</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lila-700">Atención</p>
            <p className="mt-1 text-2xl font-black text-lila-900">1:1</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lila-700">Personalización</p>
            <p className="mt-1 text-2xl font-black text-lila-900">Total</p>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <article className="reveal-up rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg" style={{ animationDelay: "120ms" }}>
          <h2 className="text-lg font-black text-lila-900">Hecho a mano</h2>
          <p className="mt-2 text-sm text-neutral-600">Cada producto es tejido cuidadosamente para mantener calidad y ternura.</p>
        </article>
        <article className="reveal-up rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg" style={{ animationDelay: "180ms" }}>
          <h2 className="text-lg font-black text-lila-900">Personalización</h2>
          <p className="mt-2 text-sm text-neutral-600">Colores, tamaños y detalles pensados para adaptarse a tu idea.</p>
        </article>
        <article className="reveal-up rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg" style={{ animationDelay: "240ms" }}>
          <h2 className="text-lg font-black text-lila-900">Atención cercana</h2>
          <p className="mt-2 text-sm text-neutral-600">Te asesoramos por WhatsApp para que tu pedido sea justo como lo imaginas.</p>
        </article>
      </div>

      <div className="mt-12 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-lila-700">Destacados</p>
            <h2 className="mt-2 text-2xl font-black text-lila-900 sm:text-3xl">Lo más querido por nuestros clientes</h2>
          </div>
          <Link
            href="/catalogo"
            className="rounded-xl bg-lila-100 px-4 py-2 text-sm font-bold text-lila-700 transition hover:bg-lila-200"
          >
            Ver todo
          </Link>
        </div>

        {productosDestacados.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-lila-200 bg-lila-50 p-5 text-sm font-semibold text-lila-800">
            Estamos preparando nuevas piezas para el catálogo.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {productosDestacados.map((producto, index) => (
              <Link
                key={producto.id}
                href={`/producto/${producto.id}`}
                aria-label={`Ver detalles de ${producto.nombre}`}
                className="reveal-up block overflow-hidden rounded-2xl border border-white/70 bg-white shadow-lg transition duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-lila-300/45"
                style={{ animationDelay: `${110 + index * 70}ms` }}
              >
                <div className="relative aspect-square">
                  <Image
                    src={imagenPortada(producto)}
                    alt={producto.nombre}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  {producto.imagenes.length > 1 && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-extrabold text-lila-700 shadow-sm backdrop-blur-sm">
                      +{producto.imagenes.length - 1} foto
                      {producto.imagenes.length > 2 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 text-base font-black text-lila-900">{producto.nombre}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{producto.descripcion}</p>
                  <p className="mt-3 text-lg font-black text-lila-700">{formatoCOP.format(producto.precio)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 rounded-3xl border border-white/60 bg-gradient-to-r from-white to-lila-100/70 p-6 shadow-lg sm:p-8">
        <h2 className="text-2xl font-black text-lila-900">Cómo encargar en 3 pasos</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/80 p-4 shadow">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-lila-700">Paso 1</p>
            <p className="mt-2 text-sm font-semibold text-neutral-700">Explora el catálogo y guarda tus favoritos.</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-4 shadow">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-lila-700">Paso 2</p>
            <p className="mt-2 text-sm font-semibold text-neutral-700">Escríbenos por WhatsApp para definir colores, tamaño y entrega.</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-4 shadow">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-lila-700">Paso 3</p>
            <p className="mt-2 text-sm font-semibold text-neutral-700">Recibe una pieza única hecha con detalle y cariño.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
