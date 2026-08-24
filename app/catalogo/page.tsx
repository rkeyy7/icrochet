import Link from "next/link";
import type { Metadata } from "next";
import { catalogo } from "@/lib/catalogo";
import ProductCard from "@/components/ProductCard";

const PAGE_SIZE = 9;
const SORT_OPTIONS = {
  nombre_asc: {
    label: "Nombre (A-Z)",
  },
  precio_asc: {
    label: "Precio (menor a mayor)",
  },
  precio_desc: {
    label: "Precio (mayor a menor)",
  },
};
const QUICK_SEARCHES = ["conejo", "ramo", "oso", "tulipán"];

export const metadata: Metadata = {
  title: "Catálogo iCrochet | Amigurumis y Ramos",
  description:
    "Explora el catálogo iCrochet con amigurumis y ramos tejidos a mano. Busca, descubre y encarga por WhatsApp.",
  openGraph: {
    title: "Catálogo iCrochet | Amigurumis y Ramos",
    description:
      "Encuentra diseños tejidos personalizados en el catálogo oficial de iCrochet.",
    type: "website",
    locale: "es_CO",
  },
};

function parsePage(value: string | undefined) {
  const parsed = Number.parseInt(value ?? "1", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return parsed;
}

function parseSort(value: string | undefined) {
  if (!value) return "nombre_asc" as const;
  if (value in SORT_OPTIONS) {
    return value as keyof typeof SORT_OPTIONS;
  }
  return "nombre_asc" as const;
}

function parsePrice(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return parsed;
}

function buildCatalogUrl({
  q,
  page,
  sort,
  min,
  max,
}: {
  q: string;
  page: number;
  sort: keyof typeof SORT_OPTIONS;
  min?: number;
  max?: number;
}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (sort !== "nombre_asc") params.set("sort", sort);
  if (typeof min === "number") params.set("min", String(min));
  if (typeof max === "number") params.set("max", String(max));
  if (page > 1) params.set("page", String(page));
  const query = params.toString();

  return query ? `/catalogo?${query}` : "/catalogo";
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    sort?: string;
    min?: string;
    max?: string;
  }>;
}) {
  const { q = "", page, sort, min, max } = await searchParams;
  const termino = q.trim();
  const sortKey = parseSort(sort);
  const selectedSort = SORT_OPTIONS[sortKey];
  const requestedPage = parsePage(page);
  const minPrecio = parsePrice(min);
  const maxPrecio = parsePrice(max);
  const rangoInvalido =
    typeof minPrecio === "number" &&
    typeof maxPrecio === "number" &&
    minPrecio > maxPrecio;

  const minAplicado = rangoInvalido ? undefined : minPrecio;
  const maxAplicado = rangoInvalido ? undefined : maxPrecio;

  const filtroPrecio =
    typeof minAplicado === "number" || typeof maxAplicado === "number";

  const terminoMinuscula = termino.toLowerCase();
  let resultados = catalogo;

  if (termino) {
    resultados = resultados.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(terminoMinuscula) ||
        producto.descripcion.toLowerCase().includes(terminoMinuscula)
    );
  }

  if (filtroPrecio) {
    resultados = resultados.filter(
      (producto) =>
        (typeof minAplicado !== "number" || producto.precio >= minAplicado) &&
        (typeof maxAplicado !== "number" || producto.precio <= maxAplicado)
    );
  }

  if (sortKey === "precio_asc") {
    resultados = [...resultados].sort((a, b) => a.precio - b.precio);
  } else if (sortKey === "precio_desc") {
    resultados = [...resultados].sort((a, b) => b.precio - a.precio);
  } else {
    resultados = [...resultados].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es")
    );
  }

  const totalResultados = resultados.length;
  const totalPaginas = Math.max(1, Math.ceil(totalResultados / PAGE_SIZE));
  const paginaActual = Math.min(requestedPage, totalPaginas);
  const skip = (paginaActual - 1) * PAGE_SIZE;
  const productos = resultados.slice(skip, skip + PAGE_SIZE);

  const inicioResultado = totalResultados === 0 ? 0 : skip + 1;
  const finResultado = Math.min(skip + productos.length, totalResultados);

  const paginasVisibles = Array.from(
    { length: totalPaginas },
    (_, idx) => idx + 1,
  ).filter((num) => Math.abs(num - paginaActual) <= 2 || num === 1 || num === totalPaginas);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-lila-700">
          Catálogo iCrochet
        </p>
        <h1 className="mt-2 text-3xl font-black text-lila-900 sm:text-4xl">
          Encuentra tu diseño ideal
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-600">
          Busca por nombre o descripción para encontrar amigurumis y ramos tejidos disponibles.
        </p>

        <form action="/catalogo" method="get" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_220px_150px_150px_auto]">
          <input
            type="text"
            name="q"
            defaultValue={termino}
            placeholder="Buscar: conejita, ramo, tulipán..."
            className="w-full rounded-2xl border border-lila-200 bg-white px-4 py-3 text-neutral-700 outline-none transition focus:border-lila-400 focus:ring-2 focus:ring-lila-200"
          />
          <select
            name="sort"
            defaultValue={sortKey}
            className="w-full rounded-2xl border border-lila-200 bg-white px-4 py-3 font-semibold text-neutral-700 outline-none transition focus:border-lila-400 focus:ring-2 focus:ring-lila-200"
          >
            {Object.entries(SORT_OPTIONS).map(([value, option]) => (
              <option key={value} value={value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="min"
            min={0}
            step={1000}
            defaultValue={typeof minPrecio === "number" ? minPrecio : ""}
            placeholder="Precio min"
            className="w-full rounded-2xl border border-lila-200 bg-white px-4 py-3 font-semibold text-neutral-700 outline-none transition focus:border-lila-400 focus:ring-2 focus:ring-lila-200"
          />
          <input
            type="number"
            name="max"
            min={0}
            step={1000}
            defaultValue={typeof maxPrecio === "number" ? maxPrecio : ""}
            placeholder="Precio max"
            className="w-full rounded-2xl border border-lila-200 bg-white px-4 py-3 font-semibold text-neutral-700 outline-none transition focus:border-lila-400 focus:ring-2 focus:ring-lila-200"
          />
          <button
            type="submit"
            className="rounded-2xl bg-lila-600 px-6 py-3 font-bold text-white shadow-lg shadow-lila-300/60 transition hover:bg-lila-700"
          >
            Aplicar
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK_SEARCHES.map((item) => (
            <Link
              key={item}
              href={buildCatalogUrl({
                q: item,
                page: 1,
                sort: sortKey,
                min: minAplicado,
                max: maxAplicado,
              })}
              className="rounded-full border border-lila-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-lila-700 transition hover:bg-lila-100"
            >
              {item}
            </Link>
          ))}

          {(termino || sortKey !== "nombre_asc" || typeof minAplicado === "number" || typeof maxAplicado === "number") ? (
            <Link
              href="/catalogo"
              className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-neutral-600 transition hover:bg-neutral-100"
            >
              Limpiar filtros
            </Link>
          ) : null}
        </div>

        {termino ? (
          <p className="mt-4 text-sm font-semibold text-neutral-600">
            {totalResultados} resultado(s) para &quot;{termino}&quot;.
          </p>
        ) : null}

        {rangoInvalido ? (
          <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
            El rango de precio no es válido. Se ignoró el filtro de precio hasta que ajustes los valores.
          </p>
        ) : null}

        {(typeof minAplicado === "number" || typeof maxAplicado === "number") && !rangoInvalido ? (
          <p className="mt-2 text-sm font-semibold text-neutral-600">
            Rango aplicado: {typeof minAplicado === "number" ? `$${minAplicado.toLocaleString("es-CO")}` : "$0"} - {typeof maxAplicado === "number" ? `$${maxAplicado.toLocaleString("es-CO")}` : "sin tope"}
          </p>
        ) : null}

        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
          Orden actual: {selectedSort.label}
        </p>

        {totalResultados > 0 ? (
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Mostrando {inicioResultado}-{finResultado} de {totalResultados}
          </p>
        ) : null}
      </div>

      {totalResultados === 0 ? (
        <div className="mt-10 rounded-3xl border-2 border-dashed border-lila-300 bg-lila-50/80 p-12 text-center shadow-lg">
          <p className="text-5xl" aria-hidden>
            🔎
          </p>
          <h2 className="mt-3 text-2xl font-black text-lila-900">
            {termino ? "No encontramos coincidencias" : "Aún no hay productos publicados"}
          </h2>
          <p className="mt-2 text-neutral-600">
            {termino
              ? "Prueba con otra palabra clave o revisa de nuevo más tarde."
              : "Estamos preparando nuevas piezas tejidas para ti."}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-2xl bg-white px-5 py-2.5 font-bold text-lila-700 shadow transition hover:bg-lila-100"
          >
            Volver al inicio
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto, index) => (
            <ProductCard key={producto.id} producto={producto} index={index} />
          ))}
        </div>
      )}

      {totalResultados > 0 ? (
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Paginación del catálogo">
          <Link
            href={buildCatalogUrl({
              q: termino,
              page: Math.max(1, paginaActual - 1),
              sort: sortKey,
              min: minAplicado,
              max: maxAplicado,
            })}
            aria-disabled={paginaActual === 1}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              paginaActual === 1
                ? "pointer-events-none bg-neutral-100 text-neutral-400"
                : "bg-white text-lila-700 shadow hover:bg-lila-100"
            }`}
          >
            Anterior
          </Link>

          {paginasVisibles.map((num) => (
            <Link
              key={num}
              href={buildCatalogUrl({
                q: termino,
                page: num,
                sort: sortKey,
                min: minAplicado,
                max: maxAplicado,
              })}
              aria-current={num === paginaActual ? "page" : undefined}
              className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                num === paginaActual
                  ? "bg-lila-600 text-white shadow"
                  : "bg-white text-lila-700 shadow hover:bg-lila-100"
              }`}
            >
              {num}
            </Link>
          ))}

          <Link
            href={buildCatalogUrl({
              q: termino,
              page: Math.min(totalPaginas, paginaActual + 1),
              sort: sortKey,
              min: minAplicado,
              max: maxAplicado,
            })}
            aria-disabled={paginaActual === totalPaginas}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              paginaActual === totalPaginas
                ? "pointer-events-none bg-neutral-100 text-neutral-400"
                : "bg-white text-lila-700 shadow hover:bg-lila-100"
            }`}
          >
            Siguiente
          </Link>
        </nav>
      ) : null}
    </section>
  );
}
