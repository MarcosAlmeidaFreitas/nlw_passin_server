import z from "zod"

export const eventSchemaResponse = z.object({
    id: z.uuid(),
    title: z.string(),
    details: z.nullish(z.string()),
    slug: z.string().nullable(),
    maximumAttendees: z.nullish(z.number().int().positive()),
    attendeesAmount: z.number().int().positive().nullable(),
  });


export type EventSchema = z.infer<typeof eventSchemaResponse>