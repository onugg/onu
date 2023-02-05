import { Client, EmbedBuilder } from "discord.js";
import * as OnuKafkaTypes from "@onu/kafka/interfaces";
import { PrismaClient, OnuPrismaExtensions } from '@onu/prisma'
var prisma = (new PrismaClient({})).$extends(OnuPrismaExtensions)

export async function memberLevelUp (c: Client, questMemberLevelUpMessage: OnuKafkaTypes.Prisma.QuestMemberLevelUpMessage) {
  var guild = await c.guilds.fetch(questMemberLevelUpMessage.discordGuildId)
  var dbGuild = await prisma.discordGuild.findUnique({where: {discordId: questMemberLevelUpMessage.discordGuildId}})
  if (!dbGuild) {return}
  if (!dbGuild.questChannelId) {return}
  var channel = await guild.channels.fetch(dbGuild.questChannelId)
  if (!channel) {return}
  var dbMember = await prisma.member.findUnique({
    where: {
      id: questMemberLevelUpMessage.memberId
    },
    include: {
      user: {
        include: {
          discordUser: true
        }
      }
    }
  })

  if (!dbMember) {return}
  if (!dbMember.user.discordUser) {return}

  var discordId = dbMember.user.discordUser.discordId

  var member = await guild.members.fetch(discordId)

  var levelUpEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`Level Up!`)
    .setDescription(`Congratulations ${member.user.username}! You have leveled up to level ${questMemberLevelUpMessage.level}!`)

  var message = `${member}`

  await (channel as any).send({content: message, embeds: [levelUpEmbed]})
}

export async function achieved(c: Client, questAchievedMessage: OnuKafkaTypes.QuestTracker.QuestAchievedMessage) {
  var guild = await c.guilds.fetch(questAchievedMessage.discordGuildId)
  var dbGuild = await prisma.discordGuild.findUnique({where: {discordId: questAchievedMessage.discordGuildId}})
  if (!dbGuild) {return}
  if (!dbGuild.questChannelId) {return}
  var channel = await guild.channels.fetch(dbGuild.questChannelId)
  if (!channel) {return}
  var dbMember = await prisma.member.findUnique({
    where: {
      id: questAchievedMessage.memberId
    },
    include: {
      user: {
        include: {
          discordUser: true
        }
      }
    }
  })

  if (!dbMember) {return}
  if (!dbMember.user.discordUser) {return}

  var discordId = dbMember.user.discordUser.discordId

  var member = await guild.members.fetch(discordId)

  var achievementEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`Quest Achieved!`)
    .setDescription(questAchievedMessage.questDescription)
    .addFields(
      { name: 'Total EXP', value: questAchievedMessage.currentExp.toString(), inline: true },
      { name: 'New EXP', value: questAchievedMessage.newExpAdded.toString(), inline: true },
    )


  var message = `${member}`

  await (channel as any).send({content: message, embeds: [achievementEmbed]})
}