"use server";

import { redirect } from "next/navigation";
import {
  clearLoginGuardState,
  createAdminSession,
  deleteAdminSession,
  getLoginGuardState,
  getAdminEntryPath,
  registerFailedLoginAttempt,
  verifyAdminCredentials,
} from "@/lib/auth/session";

export type LoginState = {
  error?: string;
};

export async function loginAdmin(
  _previousState: LoginState | undefined,
  formData: FormData,
): Promise<LoginState | undefined> {
  const loginGuard = await getLoginGuardState();
  if (loginGuard.locked) {
    const minutos = Math.ceil(loginGuard.remainingSeconds / 60);
    return { error: `Demasiados intentos. Intenta nuevamente en ${minutos} minuto(s).` };
  }

  const usuario = String(formData.get("usuario") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!usuario || !password) {
    return { error: "Ingresa tu usuario y contraseña." };
  }

  const credencialesValidas = await verifyAdminCredentials(usuario, password);
  if (!credencialesValidas) {
    const state = await registerFailedLoginAttempt();
    if (state.locked) {
      const minutos = Math.ceil(state.remainingSeconds / 60);
      return { error: `Acceso bloqueado temporalmente por seguridad. Vuelve en ${minutos} minuto(s).` };
    }

    return { error: "Credenciales inválidas. Intenta de nuevo." };
  }

  await clearLoginGuardState();
  await createAdminSession(usuario);
  redirect("/admin");
}

export async function logoutAdmin() {
  await deleteAdminSession();
  redirect(getAdminEntryPath());
}
