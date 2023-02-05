import { OnuKafka } from '@onu/kafka';
import { schedulerKafkaOptions } from '@onu/config';
import { scheduleJob } from 'node-schedule'
import * as OnuKafkaTypes from "@onu/kafka/interfaces";
import { PrismaClient, OnuPrismaExtensions } from '@onu/prisma'
var prisma = (new PrismaClient({})).$extends(OnuPrismaExtensions)

var k = OnuKafka(schedulerKafkaOptions)

async function start() {
  await k.startProducer()

  // cron every minute
  

  scheduleJob('0 0 0 * *', async () => {
   var communities = await prisma.community.findMany({})
   communities.forEach((community) => {
    var today = new Date()
    var todaysDayNumber = today.getDay()

    if (todaysDayNumber === community.weeklyStreakStartDayNumber) {
      var message: OnuKafkaTypes.Scheduler.SchedulerWeeklyStreakCommunityResetMessage = {
        communityId: community.id
      }
  
      k.emitEvent(OnuKafkaTypes.Scheduler.SchedulerWeeklyStreakCommunityResetTopic, message)
    }
   })
  })
}

start()