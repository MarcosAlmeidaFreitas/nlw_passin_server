import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { prisma_client } from "../client/prisma_client.ts"
import { HTTP_Status_Code } from "../status_code/index.ts"

export const getAttendeesForEvent: FastifyPluginAsyncZod = async (server) => {
  await server.get(
    "/events/:eventId/attendees",
    {
      schema: {
        tags: ["Attendees"],
        summary: "Obtendo todos os attendees de um evento",
        params: z.object({
          eventId: z.uuid(),
        }),
        querystring: z.object({
          pageIndex: z.string().nullish().default("0").transform(Number),
          query: z.string().nullish(),
        }),

        response: {
          200: z.object({
            totalAttendees: z.number(),
            attendees: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.email(),
                createdAt: z.date(),
                checkInAt: z.date().nullable(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params
      const { pageIndex, query } = request.query

      const attendees = await prisma_client.attendee.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          checkIn: {
            select: {
              createdAt: true,
            },
          },
        },

        //interpretação se existir uma query pesquise pelo nome e pelo eventId se não existir pesquise somente por eventId
        where: query
          ? {
              eventId,
              name: {
                contains: query,
              },
            }
          : {
              eventId,
            },
        take: 10,
        skip: pageIndex * 10,
        orderBy: {
          createdAt: "asc",
        },
      })

      const totalAttendees = await prisma_client.attendee.count({
        where: query
          ? {
              eventId,
              name: {
                contains: query,
              },
            }
          : {
              eventId,
            },
      })

      return reply.status(HTTP_Status_Code.OK).send({
        totalAttendees,
        attendees: attendees.map((attendee) => {
          return {
            id: attendee.id,
            name: attendee.name,
            email: attendee.email,
            createdAt: attendee.createdAt,
            checkInAt: attendee.checkIn?.createdAt ?? null,
          }
        }),
      })
    }
  )
}
