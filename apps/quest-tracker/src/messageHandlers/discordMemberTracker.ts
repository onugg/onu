import * as OnuKafkaTypes from "@onu/kafka/interfaces";
import { PrismaClient, OnuPrismaExtensions } from '@onu/prisma'
var prisma = (new PrismaClient({})).$extends(OnuPrismaExtensions)

export async function routeTrackerMessage (_emitEventCallback: Function, message: OnuKafkaTypes.MetricTracker.DiscordMemberTrackerUpdateMessage) {

  var discordGuild = await prisma.discordGuild.findUnique({where: {discordId: message.discordGuildId}})
  if (!discordGuild) {return}

  var config = await prisma.discordQuestConfig.findUnique({where: {discordGuildId: discordGuild.id}})
  if (!config) {return}

  if (!config.discordQuestsEnabled) {return}

  var discordUser = await prisma.discordUser.findUnique({where: {discordId: message.discordUserId}})
  if (!discordUser) {return}

  var discordMemberQuestRecord = await prisma.discordMemberQuestRecord.findUnique({where: {discordMemberId: discordUser.id}})
  if (!discordMemberQuestRecord) {
    discordMemberQuestRecord = await prisma.discordMemberQuestRecord.create({
      data: {
        discordMemberId: discordUser.id
      }
    })
  }

  switch (message.updatedField) {
    case 'messagesSent': {
      if (!config.messagesSentEnabled) {return}
      var level = await calculateLevel(config.messagesSentIncrementByLevel, message.messagesSent)
      if (level > discordMemberQuestRecord.messagesSentLevel) {
        await prisma.discordMemberQuestRecord.update({
          where: {discordMemberId: discordUser.id},
          data: {messagesSentLevel: level}
        })
      }
    }
  }
}

async function calculateLevel(levelIncrement: number, valueToAssess: number) {
  var currentValue: number = 0
  var currentLevel: number = 0
  while (valueToAssess >= currentValue) {
      currentLevel = currentLevel + 1
      currentValue = currentValue + (currentLevel * levelIncrement)
  }

  return currentLevel - 1
}