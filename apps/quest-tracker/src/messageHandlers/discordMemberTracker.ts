import * as OnuKafkaTypes from "@onu/kafka/interfaces";
import { PrismaClient, OnuPrismaExtensions } from '@onu/prisma'
var prisma = (new PrismaClient({})).$extends(OnuPrismaExtensions)

export async function routeTrackerMessage (emitEventCallback: Function, message: OnuKafkaTypes.MetricTracker.DiscordMemberTrackerUpdateMessage) {

  var discordGuild = await prisma.discordGuild.findUnique({where: {discordId: message.discordGuildId}})
  if (!discordGuild) {
    console.log(`Discord guild ${message.discordGuildId} not found`)
    return
  }
  if (!discordGuild.communityId) {
    console.log(`Discord guild ${message.discordGuildId} does not have a communityId`)
    return
  }

  var community = await prisma.community.findUnique({where: {id: discordGuild.communityId}})
  if (!community) {
    console.log(`Community ${discordGuild.communityId} not found`)
    return
  }

  var discordQuestConfig = await prisma.discordQuestConfig.findUnique({where: {discordGuildId: discordGuild.id}})
  if (!discordQuestConfig) {
    console.log(`Discord guild ${message.discordGuildId} does not have a quest configuration`)
    return
  }

  if (!discordQuestConfig.discordQuestsEnabled) {
    console.log(`Discord guild ${message.discordGuildId} does not have quests enabled`)
    return
  }

  var discordUser = await prisma.discordUser.findUnique({where: {discordId: message.discordUserId}})
  if (!discordUser) {
    console.log(`Discord user ${message.discordUserId} not found`)
    return
  }

  var user = await prisma.user.findUnique({where: {id: discordUser.userId}})
  if (!user) {
    console.log(`User ${discordUser.userId} not found`)
    return
  }

  var member = await prisma.member.findUnique({where: {userId_communityId: {userId: user.id, communityId: community.id}}})
  if (!member) {
    console.log(`Member ${user.id} not found in community ${community.id}`)
    return
  }

  var memberQuestRecord = await prisma.memberQuestRecord.findUnique({where: {memberId: member.id}})
  if (!memberQuestRecord) {
    memberQuestRecord = await prisma.memberQuestRecord.create({
      data: {
        memberId: member.id
      }
    })
  }

  switch (message.updatedField) {
    case 'messagesSent': {
      if (!discordQuestConfig.messagesSentEnabled) {return}
      var level = await calculateLevel(discordQuestConfig.messagesSentIncrementByLevel, message.messagesSent)
      var requiredForLevel = await valueRequiredForLevel(discordQuestConfig.messagesSentIncrementByLevel, level)
      if (message.messagesSent != requiredForLevel) {return}
      var newExp = level * discordQuestConfig.messagesSentRewardMultiplierByLevel
      var existingExp = memberQuestRecord.totalExp
      var totalExp = existingExp + newExp
      if (level > memberQuestRecord.discordMessagesSentLevel) {
        await prisma.memberQuestRecord.update({
          where: {memberId: member.id},
          data: {discordMessagesSentLevel: level, totalExp: totalExp}
        })

        var questAchievedMessage: OnuKafkaTypes.QuestTracker.QuestAchievedMessage = {
          communityId: community.id,
          discordGuildId: discordGuild.discordId,
          memberId: member.id,
          currentExp: totalExp,
          newExpAdded: newExp,
          domain: 'discord',
          questType: 'messagesSent',
          questDescription: `Send ${message.messagesSent} messages in Discord` 
        }

        emitEventCallback(OnuKafkaTypes.QuestTracker.DiscordMessagesSentQuestAchievedTopic, questAchievedMessage)
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

async function valueRequiredForLevel(levelIncrement: number, level: number) {
  var totalValue = 0
  for (let l = 1; l <= level; l++) {
    totalValue = totalValue + (l * levelIncrement)
  }
  return totalValue
}