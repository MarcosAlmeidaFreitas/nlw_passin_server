/** biome-ignore-all lint/style/useFilenamingConvention: <explanation> */

import { PrismaClient } from "@prisma/client"
import { env } from "../environment/env.ts"

export const prisma_client = new PrismaClient({
  log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
})
