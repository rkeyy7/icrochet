import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Link from "next/link";
import { logoutAdmin } from "@/app/auth/actions";
import { getAdminSession } from "@/lib/auth/session";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "iCrochet | Tejido con amor",
  description:
    "Catálogo virtual de amigurumis y ramos florales hechos a mano. Encarga el tuyo por WhatsApp.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const adminSession = await getAdminSession();

  return (
    <html lang="es" suppressHydrationWarning className={`${nunito.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        <header className="sticky top-0 z-30 border-b border-white/35 bg-lila-500/85 text-white shadow-lg shadow-lila-900/10 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-extrabold tracking-tight transition hover:scale-[1.01] hover:text-lila-100"
            >
              <span aria-hidden>🧶</span> iCrochet
            </Link>
            <nav className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="rounded-full px-4 py-2 font-bold transition hover:bg-white/20"
              >
                Inicio
              </Link>
              <Link
                href="/catalogo"
                className="rounded-full px-4 py-2 font-bold transition hover:bg-white/20"
              >
                Catálogo
              </Link>
              {adminSession ? (
                <form action={logoutAdmin}>
                  <button
                    type="submit"
                    className="rounded-full bg-white px-4 py-2 font-bold text-lila-700 shadow-sm transition hover:bg-lila-100"
                  >
                    Salir
                  </button>
                </form>
              ) : null}
            </nav>
          </div>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="border-t border-white/30 bg-lila-100/80 py-8 text-center text-sm font-semibold text-lila-800 backdrop-blur-sm">
          Hecho con amor, hilo y mucha paciencia · iCrochet {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
