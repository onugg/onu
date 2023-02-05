import { Client } from '../classes/onuClient.js'
import { Once, Discord } from "discordx";
import type { ArgsOf } from "discordx";
import { brokers, common } from '@onu/events'

@Discord()
export class EventReady {
  @Once()
  ready([]: ArgsOf<"ready">, bot: Client): void {

    /*
    TODO: Sharding is currently not enabled in the main-discord-bot
    if (bot.shard) {
      bot.emitKnativeEvent({type: 'shard.ready', data: {shardId: bot.shard?.ids[0]}})
      .catch((e: any) => {
        console.log(e)
      })
    }
    */

  }
}
