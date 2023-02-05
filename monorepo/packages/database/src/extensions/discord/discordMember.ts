import { PrismaClient, Prisma } from '@prisma/client';
//import * as OnuKafkaTypes from "@onu/kafka/interfaces";
import * as discordUser from './discordUser'

var prisma = new PrismaClient();

export async function deleteIfExists(emitEventCallBack: Function, discordMemberDeleteArgs: Prisma.DiscordMemberDeleteArgs) {

  var member = await prisma.discordMember.findUnique({
    where: discordMemberDeleteArgs.where
  })

  if (member) {
    await prisma.discordMember.delete({
      where: discordMemberDeleteArgs.where
    })

    /*var discordMemberDeletedMessage: OnuKafkaTypes.Prisma.DiscordMemberMessage = {
      discordGuildId: discordMemberDeleteArgs.where.discordUserId_discordGuildId?.discordGuildId!,
      discordUserId: discordMemberDeleteArgs.where.discordUserId_discordGuildId?.discordUserId!
    }

    emitEventCallBack(OnuKafkaTypes.Prisma.DiscordMemberDeletedTopic, discordMemberDeletedMessage)*/
  }

  // delete the user if this was their last membership
  var totalMembersForUser = await prisma.discordMember.count({
    where: {
      discordUserId: discordMemberDeleteArgs.where.discordUserId_discordGuildId?.discordUserId!
    }
  })

  if (totalMembersForUser === 0) {
    discordUser.deleteIfExists(emitEventCallBack, {where: {discordId: discordMemberDeleteArgs.where.discordUserId_discordGuildId?.discordUserId!}})
  }
}

export async function createIfNotExists(emitEventCallBack: Function, discordMemberCreateArgs: Prisma.DiscordMemberCreateArgs) {
  var member = await prisma.discordMember.findUnique({
    where: {
      discordUserId_discordGuildId: {
        discordGuildId: discordMemberCreateArgs.data.discordGuildId!,
        discordUserId: discordMemberCreateArgs.data.discordUserId!
      }
    }
  })

  if (!member) {
    member = await prisma.discordMember.create({
      data: discordMemberCreateArgs.data
    })

    /*var discordMemberCreatedMessage: OnuKafkaTypes.Prisma.DiscordMemberMessage = {
      discordGuildId: discordMemberCreateArgs.data.discordGuildId!,
      discordUserId: discordMemberCreateArgs.data.discordUserId!
    }

    emitEventCallBack(OnuKafkaTypes.Prisma.DiscordMemberCreatedTopic, discordMemberCreatedMessage)*/
  }
  
  return member
}