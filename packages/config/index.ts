// discord bot configuration
import type { ShardManagerOptions } from '../../apps/discord-bot/src/shard-manager'

export const shardManagerOptions: ShardManagerOptions = {
  dev: false,
  port: 2022,
  prefix: '/trpc',
}