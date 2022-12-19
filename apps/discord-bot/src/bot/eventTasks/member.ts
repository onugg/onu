import { GuildMember } from 'discord.js';
import { PrismaClient } from '@onu/prisma'
import * as OnuKafkaTypes from "@onu/kafka/interfaces";

var prisma = new PrismaClient()

// add a member and user to database if they join - will update if they already exist (e.g. user is in other guild already)
export async function AddOrUpdateMemberAndUser (member: GuildMember) {
  prisma.discordUser.upsert({
    where: {discordId: member.user.id},
    update: {name: member.user.username, discriminator: member.user.discriminator},
    create: {discordId: member.user.id, name: member.user.username, discriminator: member.user.discriminator}
  }).then((dbUser) => {
    prisma.discordGuild.findUnique({where: {discordId: member.guild.id}}).then((dbGuild) => {
      if (dbGuild) {
        prisma.discordMember.upsert({
          where: {discordUserId_discordGuildId: {discordUserId: dbUser.id, discordGuildId: dbGuild.id}},
          update: {nickname: member.nickname},
          create: {discordUserId: dbUser.id, discordGuildId: dbGuild.id, nickname: member.nickname}
        }).then(() => {
          console.log(`Member [${member.user.username}] synchronised with database`)
        })
      }
    })
  })
}

export async function emitMemberAddedToGuild(emitEventCallback: Function, message: OnuKafkaTypes.DiscordBot.MemberAddedToGuildMessage) {
  emitEventCallback(OnuKafkaTypes.DiscordBot.MemberAddedToGuildTopic, message)
} 

// remove a member from the database if they leave
export async function RemoveMember (member: GuildMember) {
  var guildInDb = await prisma.discordGuild.findUnique({where: {discordId: member.guild.id}})
  var userInDb = await prisma.discordUser.findUnique({where: {discordId: member.user.id}})

  if (guildInDb && userInDb) {
    await prisma.discordMember.delete({
      where: {discordUserId_discordGuildId: {discordUserId: userInDb.id, discordGuildId: guildInDb.id}}
    })
    console.log(`Member [${member.user.username}] removed from guild [${member.guild.name}]`)
  }

  if (userInDb) {
    var totalGuildsUserIsMemberOf = await prisma.discordMember.count({where: {discordUserId: userInDb.id}})
    if (totalGuildsUserIsMemberOf == 0) {
      await prisma.discordUser.delete({where: {id: userInDb.id}})
      console.log(`User [${member.user.username}] removed from database (no guilds)`)
    }
  }
}

export async function emitMemberLeftGuild(emitEventCallback: Function, message: OnuKafkaTypes.DiscordBot.MemberLeftGuildMessage) {
  emitEventCallback(OnuKafkaTypes.DiscordBot.MemberLeftGuildTopic, message)
} 