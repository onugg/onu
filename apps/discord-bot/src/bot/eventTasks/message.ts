import { Message } from "discord.js";
import * as OnuKafkaTypes from "@onu/kafka/interfaces";

export async function messageCreate (emitEventCallBack: Function, message: Message) {
  var messageCreatedMessage: OnuKafkaTypes.DiscordBot.MessageCreatedMessage = {
    guildDiscordId: message.guild?.id!,
    channelDiscordId: message.channel.id,
    authorDiscordId: message.author.id,
    messageDiscordId: message.id,
    messageContent: message.content
  }

  emitEventCallBack(OnuKafkaTypes.DiscordBot.MessageCreatedTopic, messageCreatedMessage)
}