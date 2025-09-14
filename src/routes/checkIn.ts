import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { prisma_client } from "../client/prisma_client.ts"
import { HTTP_Status_Code } from "../status_code/index.ts"

export const checkIn: FastifyPluginAsyncZod = async (server) => {
  await server.get(
    "/attendees/:attendeeId/check-in",
    {
      schema: {
        tags: ['Attendees'],
        summary: "Rota para fazer o check in do participante",
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          201: z.null(),
          401: z.string()
        }
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params

      const attendeeCheckIn = await prisma_client.checkIn.findUnique({
        where: {
          attendeeId
        }
      })

      if(attendeeCheckIn !== null){
        reply.status(HTTP_Status_Code.UNAUTHORIZED).send("Attendee already checked in")
      }

      await prisma_client.checkIn.create({
        data: {
          attendeeId
        }
      })

      return reply.status(HTTP_Status_Code.CREATED).send()
    }
  )
}
