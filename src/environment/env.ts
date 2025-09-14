import z from "zod"

const PORT = 3333

const environmentSchema = z.object({
  PORT: z.coerce.number().default(PORT),
  DATABASE_URL: z.url(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
})

export const env = environmentSchema.parse(process.env)
