import { PrismaClient, Prisma } from '@prisma/client';
import { brokers } from '@onu/events'
import { z } from 'zod'
//import * as OnuKafkaTypes from "@onu/kafka/interfaces";

var prisma = new PrismaClient();

export async function deleteIfExists(emitEventCallBack: Function, discordGuildDeleteArgs: Prisma.DiscordGuildDeleteArgs) {
  var guild = await prisma.discordGuild.findUnique({
    where: discordGuildDeleteArgs.where
  })

  if (guild) {
    await prisma.discordGuild.delete({
      where: discordGuildDeleteArgs.where
    })
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

      var discordGuildUpdatedMessage: z.infer<typeof brokers.onuDatabase.discordGuildUpdated_v1.dbDiscordGuildUpdate> = {
        id: guild.id,
        updatedFields: ["communityId"],
        discordId: guild.discordId
      }

      var source, name, guildUpdateEvent = brokers.onuDatabase.discordGuildUpdated_v1.EventLoader(discordGuildUpdatedMessage)

      emitEventCallBack({sourcename: source, type: name, event: guildUpdateEvent})
    }

  } else {
    guild = await prisma.discordGuild.create({
      data: discordGuildUpsertArgs.create
    })

    var discordGuildCreateMessage: z.infer<typeof brokers.onuDatabase.discordGuildCreated_v1.dbDiscordGuild> = {
      id: guild.id,
      name: guild.name ? guild.name : "",
      discordId: guild.discordId
    }

    var source, name, guildCreateEvent = brokers.onuDatabase.discordGuildCreated_v1.EventLoader(discordGuildCreateMessage)

    emitEventCallBack({sourcename: source, type: name, event: guildCreateEvent})
  }

  return guild
}