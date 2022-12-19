import * as OnuKafkaTypes from "@onu/kafka/interfaces";


export async function emitShardReady(emitEventCallback: Function, message: OnuKafkaTypes.DiscordBot.ShardStartedMessage) {
  emitEventCallback(OnuKafkaTypes.DiscordBot.ShardStartedTopic, message)
} 