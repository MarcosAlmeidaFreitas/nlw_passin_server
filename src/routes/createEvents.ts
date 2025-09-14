/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <explanation> */
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { prisma_client } from "../client/prisma_client.ts"
import { HTTP_Status_Code } from "../status_code/index.ts"
import { generateSlug } from "../utils/generateSlug.ts"

const minTitle = 4

export const createEvent: FastifyPluginAsyncZod = async (server) => {
  await server.post(
    "/events",
    {
      schema: {
        tags: ["Events"],
        summary: "Create Event",
        description: "Esta rota cria um evento e retorna o id do evento",
        body: z.object({
          title: z.string().min(minTitle),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            eventId: z.string(),
            slug: z.string(),
          }),
          400: z.object({
            message: z.string()
          })
        },
      },
    },
    async (request, reply) => {
      const { title, details, maximumAttendees } = request.body

      const slug = generateSlug(title)

      const eventWithSameSlug = await prisma_client.event.findUnique({
        where: {
          slug
        }
      })

      if(eventWithSameSlug !== null) {
        return reply.status(HTTP_Status_Code.BAD_REQUEST).send({message: "Another event with same title already exists."})
      }

      const event = await prisma_client.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug,
        },
      })

      return reply
        .status(HTTP_Status_Code.CREATED)
        .send({ eventId: event.id, slug: event.slug })
    }
  )
}
