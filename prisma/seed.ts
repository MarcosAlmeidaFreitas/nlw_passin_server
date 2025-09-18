/** biome-ignore-all lint/suspicious/noConsole: <explanation> */
import { prisma_client } from "../src/client/prisma_client.ts"

async function seed() {
  await prisma_client.event.create({
    data: {
      id: "9efb0f48-de2a-4618-b447-530252abba05",
      title: 'NLW Summer',
      slug: 'nlw-summer',
      details: "Um evento para quem é quente na programação",
      maximumAttendees: 120
    }
  })
}


seed().then(() => {
  console.log("Database seed!")
  prisma_client.$disconnect()
})