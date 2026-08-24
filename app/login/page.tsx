import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // El panel solo existe en el equipo de administración, nunca en producción.
  if (process.env.NODE_ENV === "production") notFound();

  redirect("/");
}
