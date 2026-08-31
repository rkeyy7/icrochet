"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  actualizarProducto,
  crearProducto,
  eliminarImagenProducto,
} from "@/app/admin/actions";
import {
  ETIQUETA_REGLAS_FOTOS,
  MAX_FOTOS_POR_PRODUCTO,
  type ProductoConImagenes,
} from "@/lib/productos";

const clasesInput =
  "w-full rounded-xl border border-lila-200 bg-white px-4 py-2.5 text-neutral-700 outline-none transition placeholder:text-neutral-400 focus:border-lila-400 focus:ring-2 focus:ring-lila-200";

const clasesLabel = "mb-1.5 block text-sm font-extrabold text-lila-800";

function BotonGuardar({ editando, habilitado }: { editando: boolean; habilitado: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || !habilitado}
      className="flex-1 rounded-2xl bg-lila-400 px-6 py-3 font-bold text-white shadow-md transition hover:bg-lila-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Guardando…" : editando ? "Guardar cambios" : "Agregar producto"}
    </button>
  );
}

function BotonQuitarFoto({ total }: { total: number }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      title={
        total <= 1 ? "El producto necesita al menos una foto" : "Quitar foto"
      }
      aria-label="Quitar esta foto"
      className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-black text-white shadow-md transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "…" : "✕"}
    </button>
  );
}

export default function ProductForm({
  producto,
}: {
  producto?: ProductoConImagenes | null;
}) {
  const editando = Boolean(producto);
  const existentes = producto?.imagenes ?? [];
  const [archivosNuevos, setArchivosNuevos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const totalFotos = existentes.length + archivosNuevos.length;
  const sinFotosSuficientes = !editando && totalFotos === 0;
  const excedeMaximo = totalFotos > MAX_FOTOS_POR_PRODUCTO;

  function alElegirArchivos(listaDeArchivos: FileList | null) {
    for (const url of previews) URL.revokeObjectURL(url);
    const seleccionados = Array.from(listaDeArchivos ?? []);
    setArchivosNuevos(seleccionados);
    setPreviews(
      seleccionados.map((archivo) => URL.createObjectURL(archivo))
    );
  }

  return (
    <div className="space-y-5">
      {editando && (
        <div>
          <p className={clasesLabel}>
            Fotos actuales ({existentes.length})
          </p>
          <div className="grid grid-cols-3 gap-3">
            {existentes.map((imagen, indice) => (
              <div
                key={imagen.id}
                className={`relative aspect-square overflow-hidden rounded-xl ring-1 ${
                  indice === 0 ? "ring-2 ring-lila-400" : "ring-lila-100"
                }`}
              >
                <Image
                  src={imagen.url}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                {indice === 0 && (
                  <span className="absolute bottom-1 left-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-lila-700">
                    Portada
                  </span>
                )}
                <div className="absolute -right-1.5 -top-1.5">
                  <form action={eliminarImagenProducto}>
                    <input type="hidden" name="imagenId" value={imagen.id} />
                    <BotonQuitarFoto total={existentes.length} />
                  </form>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs font-semibold text-neutral-400">
            La primera foto es la portada del producto.
          </p>
        </div>
      )}

      <form
        action={editando ? actualizarProducto : crearProducto}
        className="space-y-4"
      >
        {producto && <input type="hidden" name="id" value={producto.id} />}

        <div>
          <label htmlFor="nombre" className={clasesLabel}>
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            required
            maxLength={80}
            defaultValue={producto?.nombre}
            placeholder="Ej. Conejita Luna"
            className={clasesInput}
          />
        </div>

        <div>
          <label htmlFor="descripcion" className={clasesLabel}>
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            required
            rows={3}
            maxLength={300}
            defaultValue={producto?.descripcion}
            placeholder="Tejida a mano en algodón…"
            className={`${clasesInput} resize-none`}
          />
        </div>

        <div>
          <label htmlFor="precio" className={clasesLabel}>
            Precio (COP)
          </label>
          <input
            id="precio"
            name="precio"
            type="number"
            min={0}
            step={1000}
            required
            defaultValue={producto?.precio}
            placeholder="45000"
            className={clasesInput}
          />
        </div>

        <div>
          <label htmlFor="imagenes" className={clasesLabel}>
            {editando ? "Añadir más fotos" : "Fotos del producto"}
          </label>
          <input
            id="imagenes"
            name="imagenes"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(evento) => alElegirArchivos(evento.target.files)}
            className="w-full cursor-pointer rounded-xl border border-dashed border-lila-300 bg-lila-50/60 px-4 py-3 text-sm font-semibold text-neutral-600 transition file:mr-3 file:rounded-lg file:border-0 file:bg-lila-500 file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-white hover:border-lila-400 file:hover:bg-lila-600 focus:outline-none focus:ring-2 focus:ring-lila-200"
          />
          <p className="mt-1.5 text-xs font-semibold text-neutral-400">
            Entre 1 y {MAX_FOTOS_POR_PRODUCTO} fotos · {ETIQUETA_REGLAS_FOTOS}
          </p>

          {previews.length > 0 && (
            <>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {previews.map((url, indice) => (
                  <div
                    key={`${url}-${indice}`}
                    className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-lila-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Vista previa ${indice + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-extrabold text-neutral-600">
                      #{existentes.length + indice + 1}
                    </span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => alElegirArchivos(null)}
                className="mt-2 text-xs font-bold text-lila-600 underline-offset-2 hover:underline"
              >
                Limpiar selección nueva
              </button>
            </>
          )}

          {sinFotosSuficientes && (
            <p className="mt-2 text-xs font-bold text-red-500">
              Agrega al menos una foto para publicar el producto.
            </p>
          )}
          {excedeMaximo && (
            <p className="mt-2 text-xs font-bold text-amber-600">
              Solo se guardarán las primeras {MAX_FOTOS_POR_PRODUCTO} fotos.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <BotonGuardar editando={editando} habilitado={!sinFotosSuficientes} />
          {editando && (
            <Link
              href="/admin"
              className="rounded-2xl bg-lila-100 px-6 py-3 font-bold text-lila-700 transition hover:bg-lila-200"
            >
              Cancelar
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
