const appName = 'prisma'

var PrismaTopics: string[] = []

export const AccountCreatedTopic = `${appName}.account.created`
PrismaTopics.push(AccountCreatedTopic)

// DiscordMember
export const DiscordMemberCreatedTopic = `${appName}.discordMember.created`
PrismaTopics.push(DiscordMemberCreatedTopic)
export const DiscordMemberDeletedTopic = `${appName}.discordMember.deleted`
PrismaTopics.push(DiscordMemberDeletedTopic)
export interface DiscordMemberMessage {
  discordGuildId: string
  discordUserId: string
}

// DiscordUser
export const DiscordUserCreatedTopic = `${appName}.discordUser.created`
PrismaTopics.push(DiscordUserCreatedTopic)
export const DiscordUserDeletedTopic = `${appName}.discordUser.deleted`
PrismaTopics.push(DiscordUserDeletedTopic)
export interface DiscordUserMessage {
  discordId: string
}

// DiscordGuild
export const DiscordGuildCreatedTopic = `${appName}.discordGuild.created`
PrismaTopics.push(DiscordGuildCreatedTopic)
export const DiscordGuildDeletedTopic = `${appName}.discordGuild.deleted`
PrismaTopics.push(DiscordGuildDeletedTopic)
export interface DiscordGuildMessage {
  discordId: string
}

export { PrismaTopics }