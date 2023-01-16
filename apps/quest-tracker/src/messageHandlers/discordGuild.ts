import * as OnuKafkaTypes from "@onu/kafka/interfaces";
import { PrismaClient, OnuPrismaExtensions } from '@onu/prisma'
var prisma = (new PrismaClient({})).$extends(OnuPrismaExtensions)

// create the guild quest configuration if it doesn't exist
export async function createGuildQuestConfig (emitEventCallback: Function, discordGuildMessage: OnuKafkaTypes.Prisma.DiscordGuildMessage) {
  var guild = await prisma.discordGuild.findUnique({where: {discordId: discordGuildMessage.discordId}})

  if (!guild) {return}

  var existingDiscordQuestConfig = await prisma.discordQuestConfig.findUnique({where: {discordGuildId: guild.id}})

  if (existingDiscordQuestConfig) {return}

  await prisma.discordQuestConfig.create({
    data: {
      discordGuildId: guild.id
    }
  })

  emitEventCallback(OnuKafkaTypes.QuestTracker.DiscordQuestConfigurationCreatedTopic, {discordGuildId: guild.id})

  console.log(`Quests configured for discord guild ${guild.name} (${guild.id})`)
}