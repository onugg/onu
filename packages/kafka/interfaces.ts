export * as DiscordBot from '../../apps/discord-bot/src/bot/kafkaProducers'
export * as Prisma from '../../packages/prisma/kafkaProducers'
export * as MetricTracker from '../../apps/metric-tracker/src/kafkaProducers'
export * as QuestTracker from '../../apps/quest-tracker/src/kafkaProducers'

import { DiscordBotTopics } from '@onu/discord-bot/src/bot/kafkaProducers'
import { PrismaTopics } from '@onu/prisma/kafkaProducers'
import { MetricTrackerTopics } from '@onu/metric-tracker/src/kafkaProducers'
import { QuestTrackerTopics } from '@onu/quest-tracker/src/kafkaProducers'

export { DiscordBotTopics, PrismaTopics, MetricTrackerTopics, QuestTrackerTopics }

export const AllTopics = DiscordBotTopics.concat(PrismaTopics, MetricTrackerTopics, QuestTrackerTopics)

export interface KafkaOptions {
  clientId: string;
  groupId: string;
}

export interface onuConsumer {
  callback: Function
  topic: string
}
