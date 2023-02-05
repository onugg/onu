import { PrismaClient, Prisma } from '@prisma/client';
//import * as OnuKafkaTypes from "@onu/kafka/interfaces";
import * as analytics from '../../analytics'

var prisma = new PrismaClient();

const levelIncrement = 50

export async function updateAndEmitLevelUpEvent(emitEventCallBack: Function, memberQuestUpdateArgs: Prisma.MemberQuestRecordUpdateArgs) {
  var existingMemberQuestRecord = await prisma.memberQuestRecord.findUnique({
    where: memberQuestUpdateArgs.where
  })
  
  if (!existingMemberQuestRecord) {return}
  
  // check if there is a level change
  if (existingMemberQuestRecord) {
    var previousLevel = existingMemberQuestRecord.level
    var newLevel = await calculateLevel(levelIncrement, existingMemberQuestRecord.totalExp)

    emitEvent: if (newLevel > previousLevel) {
      var dbMember = await prisma.member.findUnique({
        where: {id: existingMemberQuestRecord.memberId},
        include: {
          community: {include: {discordGuild: true}},
          user: {include: {discordUser: true}}
        }
      })
      
      if (!dbMember) {break emitEvent}
      if (!dbMember.community) {break emitEvent}
      if (!dbMember.community.discordGuild) {break emitEvent}
      if (!dbMember.user) {break emitEvent}
      if (!dbMember.user.discordUser) {break emitEvent}

      memberQuestUpdateArgs.data.level = newLevel

      /*var questMemberLevelUpMessage: OnuKafkaTypes.Prisma.QuestMemberLevelUpMessage = {
        communityId: dbMember.communityId,
        memberId: dbMember.id,
        discordGuildId: dbMember.community.discordGuild.discordId,
        discordUserId: dbMember.user.discordUser.discordId,
        level: newLevel
      }
  
      emitEventCallBack(OnuKafkaTypes.Prisma.QuestMemberLevelUp, questMemberLevelUpMessage)*/
    }

    /*var memberQuestRecord = await prisma.memberQuestRecord.update({
      where: memberQuestUpdateArgs.where,
      data: memberQuestUpdateArgs.data
    })

    analytics.updateAnalyticsForMemberQuestRecordDailySnapshot(memberQuestRecord)*/
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