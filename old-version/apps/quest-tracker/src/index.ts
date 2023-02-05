import { OnuKafka } from '@onu/kafka';
import { questTrackerKafkaOptions } from '@onu/config';
import * as OnuKafkaTypes from "@onu/kafka/interfaces";
import * as messageHandlers from './messageHandlers'
import { PrismaClient, OnuPrismaExtensions } from '@onu/prisma'
var prisma = (new PrismaClient({})).$extends(OnuPrismaExtensions)
import * as streakTracker from './streakTracker'

var k = OnuKafka(questTrackerKafkaOptions)

async function trackMetric(topicName: string, message: any) {
  console.log("Received message on topic: " + topicName)

  // streak tracking
  if ([
    OnuKafkaTypes.DiscordBot.MessageCreatedTopic
  ].includes(topicName)) {
    var memberId = undefined
    var communityId = undefined
    if (topicName === OnuKafkaTypes.DiscordBot.MessageCreatedTopic) {
      var msg = JSON.parse(message) as OnuKafkaTypes.DiscordBot.MessageCreatedMessage
      var discordUser = await prisma.discordUser.findUnique({where: {discordId: msg.authorDiscordId}, include: {user: true}})
      if (!discordUser) {return}
      var discordGuild = await prisma.discordGuild.findUnique({where: {discordId: msg.guildDiscordId}, include: {community: true}})
      if (!discordGuild) {return}
      if (!discordGuild.community) {return}

      var member = await prisma.member.findUnique({where: {userId_communityId: {userId: discordUser.user.id, communityId: discordGuild.community.id}}})
      if (!member) {return}
      memberId = member.id
      communityId = member.communityId
    }
    if (memberId && communityId) {
      streakTracker.streakUpdate(k.emitEvent, memberId, communityId)
    }
  }

  switch (topicName) {
    case OnuKafkaTypes.Scheduler.SchedulerWeeklyStreakCommunityResetTopic:
      messageHandlers.resetStreaks.resetStreaks(JSON.parse(message))
      break
    case OnuKafkaTypes.MetricTracker.DiscordMemberTrackerUpdateTopic:
      messageHandlers.discordMember.routeTrackerMessage(k.emitEvent, JSON.parse(message))
      break
    case OnuKafkaTypes.Prisma.DiscordGuildCreatedTopic:
      messageHandlers.discordGuild.createGuildQuestConfig(k.emitEvent, JSON.parse(message))
      break
    default:
      console.log("Unknown topic")
  }
}

async function start() {
  k.registerConsumers([
    {callback: trackMetric, topic: OnuKafkaTypes.Scheduler.SchedulerWeeklyStreakCommunityResetTopic},
    {callback: trackMetric, topic: OnuKafkaTypes.DiscordBot.MessageCreatedTopic},
    {callback: trackMetric, topic: OnuKafkaTypes.Prisma.DiscordGuildCreatedTopic},
    {callback: trackMetric, topic: OnuKafkaTypes.MetricTracker.DiscordMemberTrackerUpdateTopic}
  ])

  await k.startProducer()
}

start()