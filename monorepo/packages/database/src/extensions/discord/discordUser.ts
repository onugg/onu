import { Prisma, PrismaClient } from '@prisma/client';
//import * as OnuKafkaTypes from "@onu/kafka/interfaces";

var prisma = new PrismaClient();

export async function createOrUpdateIfNotExists(emitEventCallBack: Function, discordUserUpsertArgs: Prisma.DiscordUserUpsertArgs) {
  var user = await prisma.discordUser.findUnique({
    where: discordUserUpsertArgs.where
  })

  if (user) {
    // to do: check if we need to update the user by comparing values between user and discordUserUpsertArgs.update
    user = await prisma.discordUser.upsert(discordUserUpsertArgs)
  } else {
    user = await prisma.discordUser.upsert(discordUserUpsertArgs)

    /*var discordMemberCreatedMessage: OnuKafkaTypes.Prisma.DiscordUserMessage = {
      discordId: discordUserUpsertArgs.create.discordId
    }
    emitEventCallBack(OnuKafkaTypes.Prisma.DiscordMemberCreatedTopic, discordMemberCreatedMessage)*/
  }

  return user
}

export async function deleteIfExists(emitEventCallBack: Function, discordUserDeleteArgs: Prisma.DiscordUserDeleteArgs) {
  var user = await prisma.discordUser.findUnique({
    where: discordUserDeleteArgs.where
  })

  if (user) {
    await prisma.discordUser.delete({
      where: discordUserDeleteArgs.where
    })

    /*var discordUserDeletedMessage: OnuKafkaTypes.Prisma.DiscordUserMessage = {
      discordId: user.discordId
    }

    emitEventCallBack(OnuKafkaTypes.Prisma.DiscordUserDeletedTopic, discordUserDeletedMessage)*/
  }
}