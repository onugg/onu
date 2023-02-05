
export const ShardStartedTopic = 'discordBot.shard.shardStarted'
export interface ShardStartedMessage {
  shardId: number;
  guilds: string[]
}