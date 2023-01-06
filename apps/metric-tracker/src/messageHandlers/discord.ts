import * as OnuKafkaTypes from "@onu/kafka/interfaces";
import { PrismaClient, OnuPrismaExtensions } from '@onu/prisma'
var prisma = (new PrismaClient({})).$extends(OnuPrismaExtensions)

export async function messageCreated (emitEventCallback: Function, message: OnuKafkaTypes.DiscordBot.MessageCreatedMessage) {
  var discordUser = await prisma.discordUser.findUnique({
    where: {
      discordId: message.authorDiscordId
    }
  })

  var discordGuild = await prisma.discordGuild.findUnique({
    where: {
      discordId: message.guildDiscordId
    }
  })
  
  if (discordUser && discordGuild) {
    var existingDiscordMember = await prisma.discordMember.findUnique({
      where: {
        discordUserId_discordGuildId: {
          discordUserId: discordUser.id,
          discordGuildId: discordGuild.id
        }
      }
    })
    
    if (existingDiscordMember) {
      var exisitingDiscordMemberTracker = await prisma.discordMemberTracker.findUnique({
        where: {
          discordMemberId: existingDiscordMember.id
        }
      })
      
      var messagesSent = 0

      if (!exisitingDiscordMemberTracker) {
        messagesSent = 1
        await prisma.discordMemberTracker.create({
          data: {
            discordMemberId: existingDiscordMember.id,
            messagesSent: 1
          }
        })
      } else {
        messagesSent = exisitingDiscordMemberTracker.messagesSent + 1
        await prisma.discordMemberTracker.update({
          where: {
            discordMemberId: existingDiscordMember.id
          },
          data: {
            messagesSent: exisitingDiscordMemberTracker.messagesSent + 1
          }
        })
      }
      
      var discordMemberTrackerUpdatedMessage: OnuKafkaTypes.MetricTracker.DiscordMemberTrackerUpdateMessage = {
        discordGuildId: message.guildDiscordId,
        discordUserId: message.authorDiscordId,
        updatedField: 'messagesSent',
        messagesSent: messagesSent
      }

      emitEventCallback(OnuKafkaTypes.MetricTracker.DiscordMemberTrackerUpdate, discordMemberTrackerUpdatedMessage)
    }
  }
}