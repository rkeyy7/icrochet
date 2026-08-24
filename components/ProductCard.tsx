import Image from "next/image";
import Link from "next/link";
import { formatoCOP, urlWhatsApp } from "@/lib/formato";
import {
  imagenPortada,
  type ProductoCatalogo,
} from "@/lib/catalogo";

function IconoWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function ProductCard({
  producto,
  index = 0,
}: {
  producto: ProductoCatalogo;
  index?: number;
}) {
  return (
    <article
      className="reveal-up group relative flex flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-lg shadow-lila-200/60 ring-1 ring-lila-100/90 transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-lila-300/45"
      style={{ animationDelay: `${120 + index * 70}ms` }}
    >
      <div className="relative aspect-square overflow-hidden bg-lila-50">
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-black/15" />
        <Image
          src={imagenPortada(producto)}
          alt={producto.nombre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        {producto.imagenes.length > 1 && (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-white/90 px-2.5 py-1 text-xs font-extrabold text-lila-700 shadow-sm backdrop-blur-sm">
            +{producto.imagenes.length - 1} foto{producto.imagenes.length > 2 ? "s" : ""}
          </span>
        )}
      </div>
      <div className="relative flex flex-1 flex-col gap-2 p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-neutral-800">
          {producto.nombre}
        </h2>
        <p className="text-sm leading-relaxed text-neutral-500">
          {producto.descripcion}
        </p>
        <div className="mt-auto pt-3">
          <span className="text-xl font-extrabold text-lila-600">
            {formatoCOP.format(producto.precio)}
          </span>
        </div>
        <a
          href={urlWhatsApp(producto.nombre)}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 mt-3 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-lila-500 to-lila-700 px-4 py-3 text-center font-bold text-white shadow-lg shadow-lila-300/50 transition hover:scale-[1.01] hover:from-lila-600 hover:to-lila-800 active:scale-[0.98]"
        >
          <IconoWhatsApp />
          Encargar por WhatsApp
        </a>
      </div>
      <Link
        href={`/producto/${producto.id}`}
        aria-label={`Ver detalles de ${producto.nombre}`}
        className="absolute inset-0 rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-lila-600"
      />
    </article>
  );
}
