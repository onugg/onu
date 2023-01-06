const appName = 'metric-tracker'

var MetricTrackerTopics: string[] = []

export const DiscordMemberTrackerUpdate = `${appName}.discordMemberTracker.update`
MetricTrackerTopics.push(DiscordMemberTrackerUpdate)

export interface DiscordMemberTrackerUpdateMessage {
  discordGuildId: string
  discordUserId: string
  updatedField: string

  // tracking fields
  messagesSent: number
}


export { MetricTrackerTopics }