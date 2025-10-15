/** biome-ignore-all lint/style/noMagicNumbers: <explanation> */
/** biome-ignore-all lint/suspicious/noConsole: <explanation> */
import { fakerPT_BR as faker } from "@faker-js/faker"
import type { Prisma } from "@prisma/client"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime.js"
import { prisma_client } from "../src/client/prisma_client.ts"

dayjs.extend(relativeTime)
dayjs.locale("pt-br")

async function seed() {
  const eventId = "9e9bd979-9d10-4915-b339-3786b1634f33"

  await prisma_client.event.deleteMany()

  await prisma_client.event.create({
    data: {
      id: eventId,
      title: "Unite Summer",
      slug: "unite-summer",
      details: "Um evento para quem é quente na programação",
      maximumAttendees: 120,
    },
  })

  const attendeesToInsert: Prisma.AttendeeUncheckedCreateInput[] = []

  for (let i = 0; i <= 120; i++) {
    const name = faker.person.firstName()
    const surName = faker.person.lastName()
    const nameString = name.toLocaleLowerCase()
    const surNameString = surName.toLocaleLowerCase()

    attendeesToInsert.push({
      id: 10_000 + i,
      name: `${name} ${surName}`,
      email: faker.internet.email({
        firstName: nameString,
        lastName: surNameString,
      }),
      eventId,
      createdAt: faker.date.recent({
        days: 30,
      }),
      checkIn: faker.helpers.arrayElement<
        Prisma.CheckInUncheckedCreateNestedOneWithoutAttendeeInput | undefined
      >([
        undefined,
        {
          create: {
            createdAt: faker.date.recent({ days: 7 }),
          },
        },
      ]),
    })
  }

  //console.log(attendeesToInsert)

  await Promise.all(
    attendeesToInsert.map((data) => {
      return prisma_client.attendee.create({
        data,
      })
    })
  )
}

seed().then(() => {
  console.log("Database seeded!")
  prisma_client.$disconnect()
})
