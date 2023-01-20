// discord bot configuration
import type { ShardManagerOptions } from '@onu/discord-bot/src/shard-manager'

export const shardManagerOptions: ShardManagerOptions = {
  dev: false,
  port: 2022,
  prefix: '/trpc',
}

import type { KafkaOptions } from '@onu/kafka/interfaces'

export const discordBotKafkaOptions: KafkaOptions = {
  clientId: 'discord-bot',
  groupId: 'discord-bot'
}

export const prismaKafkaOptions: KafkaOptions = {
  clientId: 'prisma',
  groupId: 'prisma'
}

export const metricTrackerKafkaOptions: KafkaOptions = {
  clientId: 'metric-tracker',
  groupId: 'metric-tracker'
}

export const questTrackerKafkaOptions: KafkaOptions = {
  clientId: 'quest-tracker',
  groupId: 'quest-tracker'
}

export const setupKafkaOptions: KafkaOptions = {
  clientId: 'setup',
  groupId: 'setup'
}

export const schedulerKafkaOptions: KafkaOptions = {
  clientId: 'scheduler',
  groupId: 'scheduler'
}