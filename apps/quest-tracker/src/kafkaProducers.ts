const appName = 'quest-tracker'

var QuestTrackerTopics: string[] = []

export const DiscordQuestConfigurationCreatedTopic = `${appName}.configuration.discord.created`
QuestTrackerTopics.push(DiscordQuestConfigurationCreatedTopic)

// quests
export const DiscordMessagesSentQuestAchievedTopic = `${appName}.quests.discord.messagesSent.achieved`
QuestTrackerTopics.push(DiscordMessagesSentQuestAchievedTopic)

export interface QuestAchievedMessage {
  communityId: string
  discordGuildId: string
  memberId: string
  currentExp: number
  newExpAdded: number
  domain: string                    // e.g. discord
  questType: string                 // e.g. discordMessagesSent
  questDescription: string          // e.g. 1000 messages sent
}

export interface DiscordQuestConfigurationCreated {
  discordGuildId: string
}


export { QuestTrackerTopics }