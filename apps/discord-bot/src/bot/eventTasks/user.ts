const { Client } = require('discord.js');
import { PrismaClient } from '@onu/prisma'
import { User } from 'discord.js';

var prisma = new PrismaClient()

export async function UpdateUser (oldUser: typeof Client.ClientUser, newUser: typeof Client.ClientUser) {
  console.log(oldUser)
  if (!prisma.discordUser.findUnique({where: {discordId: newUser.id}})) {
    AddOrUpdateUser(newUser)
  }
}

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

export async function UserExists (discordId: string) {
  if (await prisma.discordUser.count({where: {discordId: discordId}}) > 0) {
    return true
  } else {
    return false
  }
}