/** biome-ignore-all lint/suspicious/noConsole: <explanation> */
/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <explanation> */
import fastify from "fastify"
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod"
import fastifySwagger from "@fastify/swagger"
import scalarAPIReference from "@scalar/fastify-api-reference"
import { env } from "./environment/env.ts"
import { HTTP_Status_Code } from "./status_code/index.ts"
import { createEvent } from "./routes/createEvents.ts"
import { RegisterForEvent } from "./routes/registerForEvent.ts"
import { GetEvents } from "./routes/getEvents.ts"
import { getEvent } from "./routes/getEvent.ts"
import { getAttendeeBadge } from "./routes/getAttendeeBadge.ts"
import { checkIn } from "./routes/checkIn.ts"
import { getAttendeesForEvent } from "./routes/getAttendeesforEvent.ts"

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true, // Colorir a saída
        translateTime: "HH:MM:ss.l", // Mostrar hora formatada
        ignore: "pid,hostname", // Ignorar esses campos
        singleLine: true, // Cada log em uma linha
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>()

if(env.NODE_ENV === "development") {
  // registrando o swagger para gerar a documentação da API
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'PASS_IN SERVER',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  })

  server.register(scalarAPIReference, {
    routePrefix: '/docs',
    configuration: {
      theme: 'kepler',
    },
  })

  console.log('🚀 Rodando em modo desenvolvimento 🚀')
}else {
  console.log('🏭 Rodando em modo produção 🏭')
}

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.get('/health', (request, reply) => {
  return reply.status(HTTP_Status_Code.OK).send({message: 'ok'})
})

server.register(createEvent)
server.register(RegisterForEvent)
server.register(GetEvents)
server.register(getEvent)
server.register(getAttendeeBadge)
server.register(checkIn)
server.register(getAttendeesForEvent)

export { server }
