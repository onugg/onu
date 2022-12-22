import * as OnuKafkaTypes from "@onu/kafka/interfaces";
import { Client, Guild } from "discord.js";


export async function emitShardReady(emitEventCallback: Function, c: Client) {

  var guilds: string[] = c.guilds.cache.map((guild: Guild) => {return guild.id})
  var shardIds: number[] = c.shard?.ids!

  var message: OnuKafkaTypes.DiscordBot.ShardStartedMessage = {
    shardIds: shardIds,
    guilds: guilds
  }

  emitEventCallback(OnuKafkaTypes.DiscordBot.ShardStartedTopic, message)
} 