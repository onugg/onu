import { PrismaClient, OnuPrismaExtensions } from "@onu/prisma";

import { env } from "../../env/server.mjs";

var unextendedPrisma = new PrismaClient({log: env.NODE_ENV === "development" ? ["query", "info", "warn"] : ["error"]})
var extendedPrisma = unextendedPrisma.$extends(OnuPrismaExtensions)

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = extendedPrisma

if (env.NODE_ENV !== "production") {
  //@ts-ignore
  global.prisma = new PrismaClient({}).$extends(OnuPrismaExtensions)
}
