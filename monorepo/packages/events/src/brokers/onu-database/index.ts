export * as discordGuildCreated_v1 from './discordGuildCreated_v1'
import * as discordGuildCreated_v1 from './discordGuildCreated_v1'
export * as discordGuildUpdated_v1 from './discordGuildUpdated_v1'
import * as discordGuildUpdated_v1 from './discordGuildUpdated_v1'
import { Event } from '../../types'

export const SourceName = 'onu/database'

export const events: Event[] = [
  {
    name: discordGuildCreated_v1.Name,
    version: 1,
    EventSchema: discordGuildCreated_v1.MessageSchema,
    EventLoader: discordGuildCreated_v1.EventLoader
  },
  {
    name: discordGuildUpdated_v1.Name,
    version: 1,
    EventSchema: discordGuildUpdated_v1.MessageSchema,
    EventLoader: discordGuildUpdated_v1.EventLoader
  }
]