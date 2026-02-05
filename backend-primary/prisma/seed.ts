import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient();

async function main() {
  await prismaClient.availableTrigger.upsert({
    where: { id: "webhook" },
    update: {},
    create: {
      id: "webhook",
      name: "Webhook",
      image: "https://img.icons8.com/color/1200/webhook.jpg"
    }
  })

  await prismaClient.availableAction.upsert({
    where: { id: "send-sol" },
    update: {},
    create: {
      id: "send-sol",
      name: "Send Solana",
      image: "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png"
    }
  })

  await prismaClient.availableAction.upsert({
    where: { id: "email" },
    update: {},
    create: {
      id: "email",
      name: "Send Email",
      image: "https://cdn.pixabay.com/photo/2016/01/26/17/15/gmail-1162901_640.png"
    }
  })
}

main();