import { PrismaClient, Prisma } from '@prisma/client';
import * as OnuKafkaTypes from "@onu/kafka/interfaces";

var prisma = new PrismaClient();

export async function deleteAndEmitEventIfExists(emitEventCallBack: Function, discordGuildDeleteArgs: Prisma.DiscordGuildDeleteArgs) {
  var guild = await prisma.discordGuild.findUnique({
    where: discordGuildDeleteArgs.where
  })

  if (guild) {
    await prisma.discordGuild.delete({
      where: discordGuildDeleteArgs.where
    })

    var discordGuildDeletedMessage: OnuKafkaTypes.Prisma.DiscordGuildMessage = {
      discordId: discordGuildDeleteArgs.where.discordId!
    }

    emitEventCallBack(OnuKafkaTypes.Prisma.DiscordGuildDeletedTopic, discordGuildDeletedMessage)
  }
}

export async function createOfNotExistsOrUpdateAndEmitEvent(emitEventCallBack: Function, discordGuildUpsertArgs: Prisma.DiscordGuildUpsertArgs) {
  var guild = await prisma.discordGuild.findUnique({
    where: discordGuildUpsertArgs.where
  })

  // to do: check if we need to update the guild by comparing values between guild and discordGuildUpsertArgs.update

  var previousGuild = guild

  if (guild) {
    guild = await prisma.discordGuild.update({
      where: discordGuildUpsertArgs.where,
      data: discordGuildUpsertArgs.update
    })

    // we can detect changes here and emit events accordingly if required
    var updatedfields: string[] = []

    if (previousGuild?.communityId != guild.communityId) {updatedfields.push("communityId")}
    if (previousGuild?.name != guild.name) {updatedfields.push("name")}
 
    if (updatedfields.length > 0) {
      var discordGuildUpdatedMessage: OnuKafkaTypes.Prisma.DiscordGuildUpdatedMessage = {
        discordId: guild.discordId,
        updatedFields: ["communityId"]
      }

      emitEventCallBack(OnuKafkaTypes.Prisma.DiscordGuildUpdatedTopic, discordGuildUpdatedMessage)
    }

  } else {
    guild = await prisma.discordGuild.create({
      data: discordGuildUpsertArgs.create
    })

    var discordGuildCreatedMessage: OnuKafkaTypes.Prisma.DiscordGuildMessage = {
      discordId: discordGuildUpsertArgs.where.discordId!
    }

    emitEventCallBack(OnuKafkaTypes.Prisma.DiscordGuildCreatedTopic, discordGuildCreatedMessage)
  }

  return guild
}