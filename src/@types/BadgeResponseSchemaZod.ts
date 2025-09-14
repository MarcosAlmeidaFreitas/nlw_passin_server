import z from "zod"

export const badgeResponseSchema = z.object({
  name: z.string(),
  email: z.email(),
  eventName: z.string(),
  eventDetails: z.string().nullable(),
  checkInURL: z.url(),
})

export type EventSchema = z.infer<typeof badgeResponseSchema>