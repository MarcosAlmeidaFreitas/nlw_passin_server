import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { prisma_client } from "../client/prisma_client.ts"
import { HTTP_Status_Code } from "../status_code/index.ts"
import { BadRequest } from "./_errors/badRequest.ts"

const minimalNameForName = 4
export const RegisterForEvent: FastifyPluginAsyncZod = async (server) => {
  await server.post(
    "/events/:eventId/attendees",
    {
      schema: {
        tags: ["Attendees"],
        summary: "Rota para cadastrar um participante em um evento",

        body: z.object({
          name: z.string().min(minimalNameForName),
          email: z.email(),
        }),

        params: z.object({
          eventId: z.uuid(),
        }),

        response: {
          201: z.object({
            attendeeId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params
      const { name, email } = request.body

      // verificando se o email ja está cadastrado no evento através do id do evento junto com o email
      const attendeeForEmail = await prisma_client.attendee.findUnique({
        where: {
          eventId_email: {
            eventId,
            email,
          },
        },
      })

      if (attendeeForEmail !== null) {
        throw new BadRequest("this email is already registered for this event")
      }

      const [amountOfAttendeeForEvent, event] = await Promise.all([
        //contando para ver quantos inscritos nesse evento
        prisma_client.attendee.count({
          where: {
            eventId,
          },
        }),

        //obtendo informações do evento para ver se existe maximum attendees nesse evento e se ja completou esse numero
        prisma_client.event.findUnique({
          where: {
            id: eventId,
          },
        }),
      ])

      if (
        event?.maximumAttendees &&
        amountOfAttendeeForEvent >= event.maximumAttendees
      ) {
        throw new BadRequest(
          "The maximum number of attendees for this event has been reached."
        )
      }

      const attendee = await prisma_client.attendee.create({
        data: {
          name,
          email,
          eventId,
        },
      })

      reply.status(HTTP_Status_Code.CREATED).send({
        attendeeId: attendee.id,
      })
    }
  )
}
