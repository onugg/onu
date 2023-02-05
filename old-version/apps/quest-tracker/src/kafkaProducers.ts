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

// streaks

export const WeeklyStreakUpdateTopic = `${appName}.weeklyStreak.updated`
QuestTrackerTopics.push(WeeklyStreakUpdateTopic)

export interface WeeklyStreakUpdateMessage {
  communityId: string
  discordGuildId: string
  memberId: string
  streakDays: number
  currentExp: number
  newExpAdded: number
  day1: boolean
  day2: boolean
  day3: boolean
  day4: boolean
  day5: boolean
  day6: boolean
  day7: boolean
  streakStartDay: number
}

export { QuestTrackerTopics }