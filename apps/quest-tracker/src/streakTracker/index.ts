import * as OnuKafkaTypes from "@onu/kafka/interfaces";
import { PrismaClient, OnuPrismaExtensions } from '@onu/prisma'
var prisma = (new PrismaClient({})).$extends(OnuPrismaExtensions)

var dailyBaseExp = 10

export async function streakUpdate(emitEventCallback: Function, memberId: string, communityId: string) {

  var existingStreak = await prisma.memberWeeklyStreak.findUnique({where: {memberId: memberId}})
  var community = await prisma.community.findUnique({where: {id: communityId}, include: {discordGuild: true}})

  if (!community) {
    console.log("Community not found")
    return
  }

  if (existingStreak) {
    // check if lastSeenDate is today
    var todaysDateWithoutTime = new Date(new Date().setHours(0,0,0,0))
    var lastSeenDateWithoutTime = new Date(new Date(existingStreak.lastSeenDateTime).setHours(0,0,0,0))
    if (todaysDateWithoutTime.getTime() === lastSeenDateWithoutTime.getTime()) {
      // do nothing
      return
    }
  }

  var streakStartDay = community.weeklyStreakStartDayNumber

  var streakDay = undefined

  var dayOfWeek = new Date().getDay() // 0 = Sunday
  if (dayOfWeek >= streakStartDay) {
    streakDay = dayOfWeek - streakStartDay
  } else {
    streakDay = 7 - (streakStartDay - dayOfWeek)
  }

  var day1 = false
  var day2 = false
  var day3 = false
  var day4 = false
  var day5 = false
  var day6 = false
  var day7 = false 

  if (existingStreak) {
    day1 = existingStreak.day1!
    day2 = existingStreak.day2!
    day3 = existingStreak.day3!
    day4 = existingStreak.day4!
    day5 = existingStreak.day5!
    day6 = existingStreak.day6!
    day7 = existingStreak.day7!
  }

  var streakChange = false

  switch (streakDay) {
    case 0:
      if (!day1) {
        day1 = true
        streakChange = true
      }
      break
    case 1:
      if (!day2) {
        day2 = true
        streakChange = true
      }
      break
    case 2:
      if (!day3) {
        day3 = true
        streakChange = true
      }
      break
    case 3:
      if (!day4) {
        day4 = true
        streakChange = true
      }
      break
    case 4:
      if (!day5) {
        day5 = true
        streakChange = true
      }
      break
    case 5:
      if (!day6) {
        day6 = true
        streakChange = true
      }
      break
    case 6:
      if (!day7) {
        day7 = true
        streakChange = true
      }
      break
  }

  var streakArray = [day1, day2, day3, day4, day5, day6, day7]

  // work backwards from today in streakArray to count streakDays
  var streakDays = 0
  var totalExpToAward = 0
  for (var i = streakDay; i >= 0; i--) {
    if (streakArray[i]) {
      streakDays++
      totalExpToAward += dailyBaseExp * streakDays
    } else {
      break
    }
  }

  console.log("here")

  if (streakChange) {
    if (existingStreak) {
      await prisma.memberWeeklyStreak.update({
        where: {memberId: memberId},
        data: {
          lastSeenDateTime: new Date(),
          day1: day1,
          day2: day2,
          day3: day3,
          day4: day4,
          day5: day5,
          day6: day6,
          day7: day7
        }
      })
    } else {
      await prisma.memberWeeklyStreak.create({
        data: {
          memberId: memberId,
          lastSeenDateTime: new Date(),
          day1: day1,
          day2: day2,
          day3: day3,
          day4: day4,
          day5: day5,
          day6: day6,
          day7: day7
        }
      })
    }

    var exisitingMemberQuestRecord = await prisma.memberQuestRecord.findUnique({where: {memberId: memberId}})

    var totalExp = (exisitingMemberQuestRecord?.totalExp ? exisitingMemberQuestRecord.totalExp : 0) + totalExpToAward

    await prisma.memberQuestRecord.updateAndEmitLevelUpEvent({
      where: {memberId: memberId},
      data: {totalExp: totalExp}
    })

    var weeklyStreakUpdateMessage: OnuKafkaTypes.QuestTracker.WeeklyStreakUpdateMessage = {
      communityId: communityId,
      discordGuildId: community.discordGuild!.discordId,
      memberId: memberId,
      streakDays: streakDays,
      currentExp: totalExp,
      newExpAdded: totalExpToAward,
      day1: day1,
      day2: day2,
      day3: day3,
      day4: day4,
      day5: day5,
      day6: day6,
      day7: day7,
      streakStartDay: streakStartDay
    }


    emitEventCallback(OnuKafkaTypes.QuestTracker.WeeklyStreakUpdateTopic, weeklyStreakUpdateMessage)
  }
}