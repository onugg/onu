import type { ServerOptions } from './services/server/src/server'

export const serverConfig: ServerOptions = {
  dev: false,
  port: 2022,
  prefix: '/trpc',
};

import type { ShardManagerOptions } from './services/discord-bot/src/shard-manager'

export const shardManagerOptions: ShardManagerOptions = {
  dev: false,
  port: 2022,
  prefix: '/trpc',
};