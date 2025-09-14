import z from "zod"

export const eventsSchemaResponse = z.array(
  z.object({
    title: z.string(),
    details: z.nullish(z.string()),
    maximumAttendees: z.nullish(z.number()),
  })
)

export type EventsSchema = z.infer<typeof eventsSchemaResponse>
