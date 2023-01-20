import * as OnuKafkaTypes from "@onu/kafka/interfaces";
import { PrismaClient, OnuPrismaExtensions } from '@onu/prisma'
var prisma = (new PrismaClient({})).$extends(OnuPrismaExtensions)

// reset streaks for all users in a community
export async function resetStreaks (message: OnuKafkaTypes.Scheduler.SchedulerWeeklyStreakCommunityResetMessage) {
  var community = await prisma.community.findUnique({where: {id: message.communityId}})
  if (!community) {return}

  console.log("Resetting streaks for community: " + community.name)

  var members = await prisma.member.findMany({where: {communityId: community.id}, include: {MemberWeeklyStreak: true}})
  if (!members) {return}

  members.forEach(async (member) => {
    if (member.MemberWeeklyStreak) {
      await prisma.memberWeeklyStreak.update({
        where: {memberId: member.id},
        data: {
          day1: false,
          day2: false,
          day3: false,
          day4: false,
          day5: false,
          day6: false,
          day7: false,
          lastSeenDateTime: undefined
        }
      })
    }
  })
}