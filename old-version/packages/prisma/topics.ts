interface fieldTopic {
  topic: string,
  fields: string[]
  trackNullToValue?: boolean,
  trackValueToNull?: boolean,
  trackValueToValue?: boolean
}

interface model {
  name: string,
  createTopicName?: string,
  updateTopicName?: string,
  deleteTopicName?: string,
  fieldTopics?: fieldTopic[]
}

export const models: model[] = [
  {
    name: 'DiscordGuild',
    createTopicName: 'database.discordGuild.created',
    updateTopicName: undefined,
    deleteTopicName: 'database.discordGuild.deleted',
    fieldTopics: [
      {
        topic: 'database.discordGuild.name',
        fields: ['botInstalled'],
        trackValueToValue: true,
      }
    ]
  }
]