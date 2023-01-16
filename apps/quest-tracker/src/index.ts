import { OnuKafka } from '@onu/kafka';
import { questTrackerKafkaOptions } from '@onu/config';
import * as OnuKafkaTypes from "@onu/kafka/interfaces";
import * as messageHandlers from './messageHandlers'

var k = OnuKafka(questTrackerKafkaOptions)

async function trackMetric(topicName: string, message: any) {
  console.log("Received message on topic: " + topicName)
  switch (topicName) {
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
    {callback: trackMetric, topic: OnuKafkaTypes.Prisma.DiscordGuildCreatedTopic},
    {callback: trackMetric, topic: OnuKafkaTypes.MetricTracker.DiscordMemberTrackerUpdateTopic}
  ])

  await k.startProducer()
}

start()