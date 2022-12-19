const appName = 'discord-bot'

export const ShardStartedTopic = `${appName}.shardStarted`

export interface ShardStartedMessage {
  shardId: number,
  guilds: string[]
}