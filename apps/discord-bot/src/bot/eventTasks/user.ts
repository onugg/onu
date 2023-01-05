import { User } from 'discord.js';
import { PrismaClient, OnuPrismaExtensions } from '@onu/prisma'
var prisma = (new PrismaClient({})).$extends(OnuPrismaExtensions)

export async function AddOrUpdateUser (user: User) {
  try { 
    console.log(`Adding discord user ${user.id} => ${user.username}#${user.discriminator}`)
    return await prisma.discordUser.upsert({
      where: {
        discordId: user.id
      },
      update: {
        name: user.username,
        discriminator: user.discriminator,
      },
      create: {
        discordId: user.id,
        name: user.username,
        discriminator: user.discriminator,
      }
    })
  }
  catch (e) {
    console.log(e)
  } finally {
    return null
  }
}