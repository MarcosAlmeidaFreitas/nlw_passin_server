import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { prisma_client } from "../client/prisma_client.ts"
import { HTTP_Status_Code } from "../status_code/index.ts"
import { badgeResponseSchema } from "../@types/BadgeResponseSchemaZod.ts"

export const getAttendeeBadge: FastifyPluginAsyncZod = async (server) => {
  await server.get(
    "/attendees/:attendeeId/badge",
    {
      schema: {
        tags: ['Attendee'],
        summary: "Rota para obter o cadastro do participante com a url para a geração do QRCode",
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),

        response: {
          200: z.object({
            badge: badgeResponseSchema
          }),
          404: z.string(),
        },
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params

      const attendee = await prisma_client.attendee.findUnique({
        where: {
          id: attendeeId,
        },
        select: {
          name: true,
          email: true,
          event: true,
        },
      })

      const baseURL = `${request.protocol}://${request.hostname}`

      const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL)

      if (attendee === null) {
        reply.status(HTTP_Status_Code.NOT_FOUND).send("Attendee not found.")
      } else {
        reply.status(HTTP_Status_Code.OK).send({
          badge: {
            name: attendee.name,
            email: attendee.email,
            eventName: attendee.event.title,
            eventDetails: attendee.event.details,
            checkInURL: checkInURL.toString(),
          },
        })
      }
    }
  )
}
