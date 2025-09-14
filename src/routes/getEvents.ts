/** biome-ignore-all lint/suspicious/noConsole: <explanation> */
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { eventsSchemaResponse } from "../@types/EventsResponseSchemasZod.ts"
import { prisma_client } from "../client/prisma_client.ts"
import { HTTP_Status_Code } from "../status_code/index.ts"

export const GetEvents: FastifyPluginAsyncZod = async (server) => {
  await server.get(
    "/events",
    {
      schema: {
        tags: ["Event"],
        summary: "Listando todos os eventos",
        querystring: z.object({
          title: z.string().optional(),
        }),
        response: {
          200: z.object({
            events: eventsSchemaResponse,
            eventCount: z.number().int().positive(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title } = request.query

      //console.log(title)

      const events = await prisma_client.event.findMany({
        where:
          title !== null
            ? {
                title: {
                  contains: title,
                },
              }
            : undefined,
        orderBy: {
          title: "asc",
        },
        select: {
          title: true,
          details: true,
          maximumAttendees: true,
        },
      })

      const eventCount = events.length

      return reply.status(HTTP_Status_Code.OK).send({ events, eventCount })
    }
  )
}
