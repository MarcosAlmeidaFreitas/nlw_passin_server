import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { prisma_client } from "../client/prisma_client.ts"
import { HTTP_Status_Code } from "../status_code/index.ts"

export const getAttendeesForEvent: FastifyPluginAsyncZod = async (server) => {
  await server.get(
    "/events/:eventId/attendees",
    {
      schema: {
        params: z.object({
          eventId: z.uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { eventId } = request.params

      const attendees = await prisma_client.attendee.findMany({
        where: {
          eventId,
        },
      })

      return reply.status(HTTP_Status_Code.OK).send({ attendees })
    }
  )
}
