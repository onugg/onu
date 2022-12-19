export * as DiscordBot from '../../apps/discord-bot/src/bot/kafkaProducers'

export interface KafkaOptions {
  clientId: string;
  groupId: string;
}

export interface onuConsumer {
  callback: Function
  topic: string
}
