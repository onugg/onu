import { PrismaClient } from '@onu/prisma'
import { Client, Message, TextChannel } from 'discord.js'
import { GuildMember } from 'discord.js'
import * as OnuKafkaTypes from "@onu/kafka/interfaces";

var prisma = new PrismaClient()

export async function checkIfMessageIsWelcome(emitEventCallback: Function, message: Message) {
  // TODO: Duplicate the welcome threads to discord js cache duplicated in database backup for sync on restart
  if (!message.channel.isThread()) {
    return
  }

  var threadId = message.channel.id

  var welcomeThread = await prisma.discordWelcomeThread.findUnique({where: {threadDiscordId: threadId}})

  if (!welcomeThread) {
    return
  }

  var existingWelcomes = await prisma.discordWelcomeThreadWelcomers.findMany({where: {discordWelcomeThreadId: welcomeThread.id}})
  var welcomer = message.author.id

  if (!existingWelcomes.find((w) => {return w.welcomerDiscordId == welcomer})) {
    await prisma.discordWelcomeThreadWelcomers.create({
      data: {
        discordWelcomeThreadId: welcomeThread.id,
        welcomerDiscordId: welcomer
      }
    })
    console.log("welcome registered")
  }

  var memberWelcome: OnuKafkaTypes.DiscordBot.MemberWelcome = {
    discordGuildId: message.guild?.id!,
    discordUserId: message.author.id
  }

  emitEventCallback(OnuKafkaTypes.DiscordBot.MemberWelcomeTopic, memberWelcome)
}
  

export async function registerWelcomeThread (c: Client, member: GuildMember) {
  var discordGuild = await prisma.discordGuild.findUnique({where: {discordId: member.guild.id}})
  if (discordGuild?.welcomeChannelId && discordGuild?.welcomeType) {
    var channel: TextChannel = c.channels.cache.get(discordGuild.welcomeChannelId) as TextChannel
      if (!channel) {
        console.log(`Welcome channel with id ${discordGuild.welcomeChannelId} not found for guild ${member.guild.id}`)
        return
      }
      if (channel?.type != 0) {
        console.log(`Welcome channel with id ${discordGuild.welcomeChannelId} is not a text channel for guild ${member.guild.id}`)
        return
      }

      // handle thread welcomes
      if (discordGuild.welcomeType == 'thread') {
        var archiveDurationMinutes: number = 60
        if (discordGuild.welcomeThreadArchiveDurationMinutes) {
          archiveDurationMinutes = discordGuild.welcomeThreadArchiveDurationMinutes
        }

        var thread = await channel.threads.create({
          name: `welcome-${member.user.username}`,
          reason: `Welcome thread for ${member.user.username}`,
          autoArchiveDuration: archiveDurationMinutes,
        })

        await prisma.discordWelcomeThread.create({
          data: {
            discordGuildId: discordGuild.id,
            threadDiscordId: thread.id,
            welcomedUserDiscordId: member.user.id
          }
        })

        thread.send({
          content: `Welcome <@${member.user.id}> to ${member.guild.name}!`,
        })
      }
  }
}