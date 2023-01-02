const appName = 'discord-bot'

var DiscordBotTopics: string[] = []

export const ShardStartedTopic = `${appName}.shardStarted`
DiscordBotTopics.push(ShardStartedTopic)
export interface ShardStartedMessage {
  shardIds: number[], 
  guilds: string[]
}

export const MemberWelcomeTopic = `${appName}.memberWelcome`
DiscordBotTopics.push(MemberWelcomeTopic)
export interface MemberWelcome {
  discordGuildId: string
  discordUserId: string
}

export { DiscordBotTopics }