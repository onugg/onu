const appName = 'discord-bot'

export const ShardStartedTopic = `${appName}.shardStarted`

export interface ShardStartedMessage {
  shardIds: number[], 
  guilds: string[]
}

export const MemberAddedToGuildTopic = `${appName}.memberAddedToGuild`

export interface MemberAddedToGuildMessage {
  discordGuildId: string
  discordUserId: string
}

export const MemberLeftGuildTopic = `${appName}.memberLeftGuild`

export interface MemberLeftGuildMessage {
  discordUserId: string
  discordGuildId: string
}

export const MemberWelcomeTopic = `${appName}.memberWelcome`

export interface MemberWelcome {
  discordGuildId: string
  discordUserId: string
}