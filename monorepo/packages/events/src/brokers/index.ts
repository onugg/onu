export * as onuMainDiscordBot from './onu-main-discord-bot/index'
import * as onuMainDiscordBot from './onu-main-discord-bot/index'
export * as onuDatabase from './onu-database'
import * as onuDatabase from './onu-database'

import { Broker } from '../types'

export const brokerList: Broker[] = [
  {
    eventSourceName: onuMainDiscordBot.SourceName,
    events: onuMainDiscordBot.events,
    canSendEvents: true
  },
  {
    eventSourceName: onuDatabase.SourceName,
    events: onuDatabase.events,
    canSendEvents: true
  }
]