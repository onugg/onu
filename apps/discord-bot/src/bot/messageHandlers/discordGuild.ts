import { Client } from "discord.js";
import * as OnuKafkaTypes from "@onu/kafka/interfaces";
import * as EventTasks from "./../eventTasks";


export async function created (c: Client, discordGuildMessage: OnuKafkaTypes.Prisma.DiscordGuildMessage) {
  EventTasks.guild.setupGuild(c, discordGuildMessage.discordId)
}