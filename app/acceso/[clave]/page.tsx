import { notFound, redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import {
  getAdminSession,
  isValidAdminEntryPath,
} from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AccesoPrivadoPage({
  params,
}: {
  params: Promise<{ clave: string }>;
}) {
  // El acceso al panel solo existe en el equipo de administración, nunca en producción.
  if (process.env.NODE_ENV === "production") notFound();

  const { clave } = await params;
  const session = await getAdminSession();

  if (!isValidAdminEntryPath(`/acceso/${clave}`)) {
    notFound();
  }

  if (session) {
    redirect("/admin");
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-12">
      <div className="grid w-full gap-8 lg:grid-cols-[1.2fr_440px] lg:items-center">
        <div className="space-y-5">
          <p className="inline-flex rounded-full border border-lila-200 bg-white/80 px-4 py-1 text-xs font-extrabold uppercase tracking-[0.25em] text-lila-700 shadow-sm">
            Acceso privado
          </p>
          <h1 className="text-4xl font-black leading-tight text-lila-900 sm:text-5xl">
            Panel interno de gestión
          </h1>
          <p className="max-w-xl text-lg text-neutral-600">
            Inicia sesión para administrar el catálogo y mantener actualizado el contenido de iCrochet.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/75 p-6 shadow-2xl shadow-lila-200/70 backdrop-blur-md sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-lila-200/40 blur-3xl" />
          <h2 className="mb-6 text-2xl font-black text-lila-900">Iniciar sesión</h2>
          <AdminLoginForm />
        </div>
      </div>
    </section>
  );
}
