import { NextResponse, type NextRequest } from "next/server";
import {
  getAdminEntryPath,
  isValidAdminEntryPath,
  readAdminSessionFromToken,
} from "@/lib/auth/session";

export default async function proxy(req: NextRequest) {
  // El panel solo existe en el equipo de administración, nunca en producción.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.next();
  }

  const path = req.nextUrl.pathname;
  const adminEntryPath = getAdminEntryPath();
  const isAdminRoute = path.startsWith("/admin");
  const isAccessRoute = path.startsWith("/acceso/");

  if (!isAdminRoute && !isAccessRoute) {
    return NextResponse.next();
  }

  if (isAccessRoute && !isValidAdminEntryPath(path)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const token = req.cookies.get("admin_session")?.value;
  const session = await readAdminSessionFromToken(token);

  if (isAdminRoute && !session) {
    return NextResponse.redirect(new URL(adminEntryPath, req.url));
  }

  if (path === adminEntryPath && session) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
