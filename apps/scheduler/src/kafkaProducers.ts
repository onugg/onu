const appName = 'scheduler'

var SchedulerTopics: string[] = []

export const SchedulerWeeklyStreakCommunityResetTopic = `${appName}.weeklyStreak.community.reset`
SchedulerTopics.push(SchedulerWeeklyStreakCommunityResetTopic)

export interface SchedulerWeeklyStreakCommunityResetMessage {
  communityId: string
}


export { SchedulerTopics }