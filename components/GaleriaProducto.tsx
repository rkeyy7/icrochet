"use client";

import Image from "next/image";
import { useState } from "react";

export default function GaleriaProducto({
  imagenes,
  nombre,
}: {
  imagenes: string[];
  nombre: string;
}) {
  const [activa, setActiva] = useState(0);
  const actual = imagenes[activa] ?? imagenes[0];

  return (
    <div className="reveal-up">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/70 bg-lila-50 shadow-xl shadow-lila-200/60">
        <Image
          src={actual}
          alt={`Foto de ${nombre}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        {imagenes.length > 1 && (
          <span className="absolute bottom-4 right-4 rounded-full bg-neutral-900/70 px-3 py-1 text-xs font-extrabold text-white backdrop-blur-sm">
            {activa + 1} / {imagenes.length}
          </span>
        )}
      </div>

      {imagenes.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3 sm:flex sm:flex-wrap">
          {imagenes.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActiva(index)}
              aria-label={`Ver foto ${index + 1} de ${nombre}`}
              aria-current={index === activa}
              className={`relative aspect-square w-full overflow-hidden rounded-2xl transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lila-500 sm:w-20 ${
                index === activa
                  ? "ring-2 ring-lila-400 ring-offset-2 ring-offset-white"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
