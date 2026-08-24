"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "@/app/auth/actions";

const estadoInicial: LoginState = {};

export default function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, estadoInicial);
  const error = state?.error;

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="usuario" className="mb-1.5 block text-sm font-extrabold text-lila-800">
          Usuario admin
        </label>
        <input
          id="usuario"
          name="usuario"
          type="text"
          autoComplete="username"
          required
          className="w-full rounded-xl border border-lila-200 bg-white/90 px-4 py-2.5 text-neutral-700 outline-none transition focus:border-lila-400 focus:ring-2 focus:ring-lila-200"
          placeholder="usuario"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-extrabold text-lila-800">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-lila-200 bg-white/90 px-4 py-2.5 text-neutral-700 outline-none transition focus:border-lila-400 focus:ring-2 focus:ring-lila-200"
          placeholder="••••••••"
        />
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-lila-500 px-6 py-3 font-bold text-white shadow-lg shadow-lila-300/60 transition hover:bg-lila-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Ingresando..." : "Entrar al panel"}
      </button>
    </form>
  );
}
