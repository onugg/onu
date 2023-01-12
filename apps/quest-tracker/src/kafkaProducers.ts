const appName = 'quest-tracker'

var QuestTrackerTopics: string[] = []

export const DiscordQuestConfigurationCreated = `${appName}.questTracker.configuration.discord.created`
QuestTrackerTopics.push(DiscordQuestConfigurationCreated)

// quests
export const DiscordMessagesSentQuestAchieved = `${appName}.questTracker.quests.discord.messagesSent.achieved`
QuestTrackerTopics.push(DiscordMessagesSentQuestAchieved)

export interface DiscordQuestAchieved {
  discordGuildId: string
  discordUserID: string
  questType: string                 // e.g. messagesSent
  questDescription: string          // e.g. 1000 messages sent
}

export interface DiscordQuestConfigurationCreated {
  discordGuildId: string
}


export { QuestTrackerTopics }