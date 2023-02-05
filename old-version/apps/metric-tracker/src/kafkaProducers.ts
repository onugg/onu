const appName = 'metric-tracker'

var MetricTrackerTopics: string[] = []

export const DiscordMemberTrackerUpdateTopic = `${appName}.discordMemberTracker.update`
MetricTrackerTopics.push(DiscordMemberTrackerUpdateTopic)

export interface DiscordMemberTrackerUpdateMessage {
  discordGuildId: string
  discordUserId: string
  updatedField: string

  // tracking fields
  messagesSent: number
}


export { MetricTrackerTopics }