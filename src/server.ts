/** biome-ignore-all lint/suspicious/noConsole: <explanation> */

import { server } from "./app.ts"
import { env } from "./environment/env.ts"

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`HTTP SERVER 🏃 ON PORT: ${env.PORT}`)
})
