export * as DiscordBot from '../../apps/discord-bot/src/bot/kafkaProducers'
export * as Prisma from '../../packages/prisma/kafkaProducers'

import { DiscordBotTopics } from '@onu/discord-bot/src/bot/kafkaProducers'
import { PrismaTopics } from '@onu/prisma/kafkaProducers'

export { DiscordBotTopics, PrismaTopics }

export const AllTopics = DiscordBotTopics.concat(PrismaTopics)

export interface KafkaOptions {
  clientId: string;
  groupId: string;
}

export interface onuConsumer {
  callback: Function
  topic: string
}
