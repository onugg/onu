import { Client } from '../classes/onuClient.js'
import { On, Discord } from "discordx";
import type { ArgsOf } from "discordx";
import { brokers } from '@onu/events'

@Discord()
export class Example {
  @On()
  messageCreate([message]: ArgsOf<"messageCreate">, bot: Client): void {
    try {
      var source, name, event = brokers.onuMainDiscordBot.guildMessageSentV1.EventLoader(message)
      bot.emitKnativeEvent({sourcename: source, type: name, event: event})
    } catch (e) {
      console.log(e)
    }
  }
}
