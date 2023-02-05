import { OnuKafka } from '@onu/kafka';
import { metricTrackerKafkaOptions } from '@onu/config';
import * as OnuKafkaTypes from "@onu/kafka/interfaces";
import * as messageHandlers from './messageHandlers'


var k = OnuKafka(metricTrackerKafkaOptions)

async function trackMetric(topicName: string, message: any) {
  switch (topicName) {
    case OnuKafkaTypes.DiscordBot.MessageCreatedTopic:
      messageHandlers.discord.messageCreated(k.emitEvent, JSON.parse(message))
      break
    default:
      console.log("Unknown topic")
  }
}

async function start() {
  k.registerConsumers([
    {callback: trackMetric, topic: OnuKafkaTypes.DiscordBot.MessageCreatedTopic}
  ])

  await k.startProducer()
}

start()