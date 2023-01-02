// discord bot configuration
import type { ShardManagerOptions } from '../../apps/discord-bot/src/shard-manager'

export const shardManagerOptions: ShardManagerOptions = {
  dev: false,
  port: 2022,
  prefix: '/trpc',
}

import type { KafkaOptions } from '../../packages/kafka/interfaces'

export const discordBotKafkaOptions: KafkaOptions = {
  clientId: 'discord-bot',
  groupId: 'discord-bot'
}

export const prismaKafkaOptions: KafkaOptions = {
  clientId: 'prisma',
  groupId: 'prisma'
}