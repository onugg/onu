export * as DiscordBot from '@onu/discord-bot/src/bot/kafkaProducers'
export * as Prisma from '@onu/prisma/kafkaProducers'
export * as MetricTracker from '@onu/metric-tracker/src/kafkaProducers'
export * as QuestTracker from '@onu/quest-tracker/src/kafkaProducers'
export * as Scheduler from '@onu/scheduler/src/kafkaProducers'

import { DiscordBotTopics } from '@onu/discord-bot/src/bot/kafkaProducers'
import { PrismaTopics } from '@onu/prisma/kafkaProducers'
import { MetricTrackerTopics } from '@onu/metric-tracker/src/kafkaProducers'
import { QuestTrackerTopics } from '@onu/quest-tracker/src/kafkaProducers'
import { SchedulerTopics } from '@onu/scheduler/src/kafkaProducers'

export { DiscordBotTopics, PrismaTopics, MetricTrackerTopics, QuestTrackerTopics, SchedulerTopics }

export const AllTopics = DiscordBotTopics.concat(PrismaTopics, MetricTrackerTopics, QuestTrackerTopics, SchedulerTopics)

export interface KafkaOptions {
  clientId: string;
  groupId: string;
}

export interface onuConsumer {
  callback: Function
  topic: string
}
