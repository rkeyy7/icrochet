import "server-only";

import { timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type AdminSession = {
  role: "admin";
  usuario: string;
};

type LoginGuardPayload = {
  type: "login-guard";
  attempts: number;
  lockedUntil?: number;
};

type LoginGuardState = {
  locked: boolean;
  attempts: number;
  remainingSeconds: number;
};

const ADMIN_COOKIE = "admin_session";
const LOGIN_GUARD_COOKIE = "admin_login_guard";
const ADMIN_ENTRY_PREFIX = "/acceso";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;
const LOGIN_GUARD_MAX_ATTEMPTS = 5;
const LOGIN_GUARD_LOCK_SECONDS = 10 * 60;
const LOGIN_GUARD_COOKIE_SECONDS = 60 * 60;
const DEV_FALLBACK_USUARIO = "admin";
const DEV_FALLBACK_PASSWORD = "admin12345";
const DEV_FALLBACK_ENTRY_SEGMENT = "panel-icrochet-2026";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET no esta configurada.");
  }
  return new TextEncoder().encode(secret);
}

function getAdminCredentials() {
  const isProd = process.env.NODE_ENV === "production";
  const usuario = process.env.ADMIN_USUARIO?.trim() || (!isProd ? DEV_FALLBACK_USUARIO : "");
  const password = process.env.ADMIN_PASSWORD?.trim() || (!isProd ? DEV_FALLBACK_PASSWORD : "");

  if (!usuario || !password) {
    throw new Error("ADMIN_USUARIO y ADMIN_PASSWORD deben estar configuradas en produccion.");
  }

  return { usuario, password };
}

function normalizeEntrySegment(segment: string) {
  return segment
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9-]/g, "");
}

export function getAdminEntrySegment() {
  const isProd = process.env.NODE_ENV === "production";
  const raw = process.env.ADMIN_ENTRY_PATH || (!isProd ? DEV_FALLBACK_ENTRY_SEGMENT : "");
  const normalized = normalizeEntrySegment(raw);

  if (!normalized) {
    throw new Error("ADMIN_ENTRY_PATH debe estar configurada en produccion.");
  }

  return normalized;
}

export function getAdminEntryPath() {
  return `${ADMIN_ENTRY_PREFIX}/${getAdminEntrySegment()}`;
}

export function isValidAdminEntryPath(pathname: string) {
  return pathname === getAdminEntryPath();
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

async function createToken(payload: AdminSession) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

async function createLoginGuardToken(payload: LoginGuardPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(`${LOGIN_GUARD_COOKIE_SECONDS}s`)
    .sign(getSecretKey());
}

async function verifyToken(token: string | undefined) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });

    if (payload.role !== "admin" || typeof payload.usuario !== "string") {
      return null;
    }

    return payload as JWTPayload & AdminSession;
  } catch {
    return null;
  }
}

async function verifyLoginGuardToken(token: string | undefined) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });

    if (
      payload.type !== "login-guard" ||
      typeof payload.attempts !== "number" ||
      (payload.lockedUntil !== undefined && typeof payload.lockedUntil !== "number")
    ) {
      return null;
    }

    return payload as JWTPayload & LoginGuardPayload;
  } catch {
    return null;
  }
}

function getGuardStateFromPayload(payload: (JWTPayload & LoginGuardPayload) | null): LoginGuardState {
  if (!payload) {
    return { locked: false, attempts: 0, remainingSeconds: 0 };
  }

  const now = Date.now();
  const lockedUntil = payload.lockedUntil ?? 0;
  const remainingSeconds = lockedUntil > now ? Math.ceil((lockedUntil - now) / 1000) : 0;

  return {
    locked: remainingSeconds > 0,
    attempts: payload.attempts,
    remainingSeconds,
  };
}

export async function getLoginGuardState() {
  const token = (await cookies()).get(LOGIN_GUARD_COOKIE)?.value;
  const payload = await verifyLoginGuardToken(token);
  const state = getGuardStateFromPayload(payload);

  if (!state.locked && state.attempts === 0 && token) {
    const cookieStore = await cookies();
    cookieStore.delete(LOGIN_GUARD_COOKIE);
  }

  return state;
}

export async function registerFailedLoginAttempt() {
  const token = (await cookies()).get(LOGIN_GUARD_COOKIE)?.value;
  const payload = await verifyLoginGuardToken(token);
  const currentState = getGuardStateFromPayload(payload);

  if (currentState.locked) {
    return currentState;
  }

  const nextAttempts = currentState.attempts + 1;
  const now = Date.now();
  const lockedUntil =
    nextAttempts >= LOGIN_GUARD_MAX_ATTEMPTS ? now + LOGIN_GUARD_LOCK_SECONDS * 1000 : undefined;

  const nextPayload: LoginGuardPayload = {
    type: "login-guard",
    attempts: nextAttempts,
    lockedUntil,
  };

  const nextToken = await createLoginGuardToken(nextPayload);
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  cookieStore.set(LOGIN_GUARD_COOKIE, nextToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: LOGIN_GUARD_COOKIE_SECONDS,
    path: "/",
  });

  return getGuardStateFromPayload({
    ...nextPayload,
    iat: Math.floor(now / 1000),
    exp: Math.floor(now / 1000) + LOGIN_GUARD_COOKIE_SECONDS,
  });
}

export async function clearLoginGuardState() {
  const cookieStore = await cookies();
  cookieStore.delete(LOGIN_GUARD_COOKIE);
}

export async function verifyAdminCredentials(usuario: string, password: string) {
  const credentials = getAdminCredentials();
  return safeCompare(usuario.trim().toLowerCase(), credentials.usuario.toLowerCase()) && safeCompare(password, credentials.password);
}

export async function createAdminSession(usuario: string) {
  const token = await createToken({ role: "admin", usuario });
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  });
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function getAdminSession() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const payload = await verifyToken(token);
  if (!payload) return null;

  return {
    role: "admin" as const,
    usuario: payload.usuario,
  };
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    redirect(getAdminEntryPath());
  }
  return session;
}

export async function readAdminSessionFromToken(token: string | undefined) {
  const payload = await verifyToken(token);
  if (!payload) return null;

  return {
    role: "admin" as const,
    usuario: payload.usuario,
  };
}
