import * as OnuKafkaTypes from "@onu/kafka/interfaces";


export async function emitShardReady(emitEventCallback: Function, ShardStartedMessage: OnuKafkaTypes.DiscordBot.ShardStartedMessage) {
  emitEventCallback(OnuKafkaTypes.DiscordBot.ShardStartedTopic, ShardStartedMessage)
} 