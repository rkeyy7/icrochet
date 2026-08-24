import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/prisma/client";

function crearCliente(): PrismaClient {
  const url = path
    .join(process.cwd(), "prisma", "dev.db")
    .replace(/\\/g, "/");
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function obtenerCliente(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = crearCliente();
  }
  return globalForPrisma.prisma;
}

// Inicialización perezosa: la base de datos solo se abre en la primera consulta.
// Así las rutas que no la usan (o el build de producción, donde no hay BD)
// nunca intentan abrir el archivo SQLite.
export const prisma = new Proxy({} as PrismaClient, {
  get(_destino, propiedad, receptor) {
    const valor = Reflect.get(obtenerCliente() as object, propiedad, receptor);
    return typeof valor === "function" ? valor.bind(obtenerCliente()) : valor;
  },
});
