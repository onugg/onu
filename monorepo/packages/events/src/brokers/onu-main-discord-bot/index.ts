export * as guildMessageSentV1 from './guildMessageSent_v1'
import * as guildMessageSentV1 from './guildMessageSent_v1'
export * as shardReadyV1 from './shardReady_v1'
import * as shardReadyV1 from './shardReady_v1'
import { Event } from '../../types'

export const SourceName = 'onu/main-discord-bot'

export const events: Event[] = [
  {
    name: guildMessageSentV1.Name,
    version: 1,
    EventSchema: guildMessageSentV1.MessageSchema,
    EventLoader: guildMessageSentV1.EventLoader
  },
  {
    name: shardReadyV1.Name,
    version: 1,
    EventSchema: shardReadyV1.MessageSchema,
    EventLoader: shardReadyV1.EventLoader
  }
]