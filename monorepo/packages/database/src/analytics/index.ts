import { PrismaClient, MemberQuestRecord, MemberQuestRecordDailySnapshot } from '@prisma/client';

var prisma = new PrismaClient();

var snapshotRetentionPeriodDays = 365

interface rankedAnalytics {
  memberId: string

  totalExp: number
  expRank: number
  totalExp7DaysAgo: number | undefined
  expRank7DaysAgo: number | undefined
}

interface membedQuestRecordIncludingRank extends MemberQuestRecord {
  expRank: number
}

interface memberQuestRecordDailySnapshotIncludingRank extends MemberQuestRecordDailySnapshot {
  expRank: number
}


// member quest record ranked analytics
export async function getCommunityRankedAnalytics(communityId: string) {
  var today = new Date()
  var todaysDateMinus7Days = new Date(today.setHours(0,0,0,0) - 7)

  var currentData = await prisma.memberQuestRecord.findMany({
    where: {
      member: {
        communityId: communityId
      }
    },
    orderBy: {
      totalExp: 'desc',
      updatedAt: 'desc'
    }
  })

  var currentDataPlusRankArray: membedQuestRecordIncludingRank[] = []
  var rank = 1
  await currentData.forEach((record) => {
    var currentDataPlusRankA = record as membedQuestRecordIncludingRank
    currentDataPlusRankA.expRank = rank
    currentDataPlusRankArray.push(currentDataPlusRankA)
    rank++
  })

  var sevenDaysAgo = await prisma.memberQuestRecordDailySnapshot.findMany({
    where: {
      member: {
        communityId: communityId
      },
      snapshotDate: todaysDateMinus7Days
    },
    orderBy: {
      totalExp: 'desc',
      updatedAt: 'desc'
    }
  })

  var sevenDaysAgoPlusRankArray: memberQuestRecordDailySnapshotIncludingRank[] = []
  rank = 1
  await sevenDaysAgo.forEach((record) => {
    var sevenDaysAgoPlusRankA = record as memberQuestRecordDailySnapshotIncludingRank
    sevenDaysAgoPlusRankA.expRank = rank
    sevenDaysAgoPlusRankArray.push(sevenDaysAgoPlusRankA)
    rank++
  })

  var rankedAnalyticsArray: rankedAnalytics[] = []
  await currentDataPlusRankArray.forEach((currentDataPlusRank) => {
    var sevenDaysAgoPlusRank = sevenDaysAgoPlusRankArray.find((sevenDaysAgoPlusRank) => {
      return sevenDaysAgoPlusRank.memberId == currentDataPlusRank.memberId
    })

    var rankedAnalytics: rankedAnalytics = {
      memberId: currentDataPlusRank.memberId,
      totalExp: currentDataPlusRank.totalExp,
      expRank: currentDataPlusRank.expRank,
      totalExp7DaysAgo: sevenDaysAgoPlusRank ? sevenDaysAgoPlusRank.totalExp : undefined,
      expRank7DaysAgo: sevenDaysAgoPlusRank ? sevenDaysAgoPlusRank.expRank : undefined
    }

    rankedAnalyticsArray.push(rankedAnalytics)
  })

  return rankedAnalyticsArray
}

export async function updateAnalyticsForMemberQuestRecordDailySnapshot (memberQuestRecord: MemberQuestRecord) {

  var snapshotDateTime = new Date()
  var snapshotDate = new Date(snapshotDateTime.setHours(0,0,0,0))
  var snapshotDateMinusRetentionPeriod = new Date(snapshotDateTime.setHours(0,0,0,0) - snapshotRetentionPeriodDays)

  // TO DO: Make this automatically update with new fields added to the model

  await prisma.memberQuestRecordDailySnapshot.upsert({
    where: {
      memberId_snapshotDate: {
        memberId: memberQuestRecord.memberId,
        snapshotDate: snapshotDate
      }
    }, 
    create: {
      memberId: memberQuestRecord.memberId,
      snapshotDate: snapshotDate,
      totalExp: memberQuestRecord.totalExp,
      level: memberQuestRecord.level,
      discordMessagesSentLevel: memberQuestRecord.discordMessagesSentLevel
    },
    update: {
      totalExp: memberQuestRecord.totalExp,
      level: memberQuestRecord.level,
      discordMessagesSentLevel: memberQuestRecord.discordMessagesSentLevel
    }
  })

  // clean up old records
  prisma.memberQuestRecordDailySnapshot.deleteMany({
    where: {
      snapshotDate: {
        lt: snapshotDateMinusRetentionPeriod
      }
    }
  })
}