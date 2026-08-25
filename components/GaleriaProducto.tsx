"use client";

import Image from "next/image";
import { useState } from "react";

export default function GaleriaProducto({ imagenes, nombre }: { imagenes: string[]; nombre: string }) {
  const [activa, setActiva] = useState(0);
  const actual = imagenes[activa] ?? imagenes[0];

  return (
    <div className="reveal-up">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border-8 border-white/75 bg-lila-100 shadow-[0_28px_70px_-25px_rgba(91,60,94,.5)] sm:border-[12px]">
        <Image src={actual} alt={`Foto de ${nombre}`} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover transition duration-700 hover:scale-[1.03]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-lila-900/20 via-transparent to-white/10" />
        <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-lila-700 shadow-sm backdrop-blur-sm">Detalle artesanal</div>
        {imagenes.length > 1 && <span className="absolute bottom-5 right-5 rounded-full bg-lila-900/75 px-3 py-1.5 text-xs font-extrabold text-white backdrop-blur-sm">{activa + 1} / {imagenes.length}</span>}
      </div>
      {imagenes.length > 1 && <div className="mt-5 grid grid-cols-5 gap-3 sm:flex sm:flex-wrap">{imagenes.map((url, index) => <button key={url} type="button" onClick={() => setActiva(index)} aria-label={`Ver foto ${index + 1} de ${nombre}`} aria-current={index === activa} className={`relative aspect-square w-full overflow-hidden rounded-2xl border-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lila-500 sm:w-20 ${index === activa ? "border-lila-500 shadow-md" : "border-white/70 opacity-60 hover:border-lila-300 hover:opacity-100"}`}><Image src={url} alt="" fill sizes="80px" className="object-cover" /></button>)}</div>}
    </div>
  );
}
