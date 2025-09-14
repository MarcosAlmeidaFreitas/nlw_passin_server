import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { eventSchemaResponse } from "../@types/EventResponseSchemaZod.ts"
import { prisma_client } from "../client/prisma_client.ts"
import { HTTP_Status_Code } from "../status_code/index.ts"

export const getEvent: FastifyPluginAsyncZod = async (server) => {
  await server.get(
    "/events/:eventId",
    {
      schema: {
        tags: ["Event"],
        summary: "Obtém todos os dados de um evento",
        params: z.object({
          eventId: z.uuid(),
        }),
        response: {
          200: z.object({
            event: eventSchemaResponse,
          }),
          404: z.string(),
        },
      },
    },

    async (request, reply) => {
      const { eventId } = request.params

      const event = await prisma_client.event.findUnique({
        where: {
          id: eventId,
        },
        select: {
          id: true,
          title: true,
          details: true,
          slug: true,
          maximumAttendees: true,
          _count: {
            select: {
              attendees: true,
            },
          },
        },
      })

      if (event === null) {
        reply.status(HTTP_Status_Code.NOT_FOUND).send("Event not found")
      } else {
        reply.status(HTTP_Status_Code.OK).send({
          event: {
            id: event.id,
            title: event.title,
            details: event.details,
            slug: event.slug,
            maximumAttendees: event.maximumAttendees,
            attendeesAmount: event._count.attendees,
          },
        })
      }
    }
  )
}
