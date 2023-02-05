const appName = 'discord-bot'

var DiscordBotTopics: string[] = []

export const ShardStartedTopic = `${appName}.shardStarted`
DiscordBotTopics.push(ShardStartedTopic)
export interface ShardStartedMessage {
  shardIds: number[], 
  guilds: string[]
}

export const MessageCreatedTopic = `${appName}.messageSent`
DiscordBotTopics.push(MessageCreatedTopic)
export interface MessageCreatedMessage {
  guildDiscordId: string,
  channelDiscordId: string,
  authorDiscordId: string,
  messageDiscordId: string,
  messageContent: string
}


export { DiscordBotTopics }