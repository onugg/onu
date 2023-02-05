import { Client, EmbedBuilder } from "discord.js";
import * as OnuKafkaTypes from "@onu/kafka/interfaces";
import { PrismaClient, OnuPrismaExtensions } from '@onu/prisma'
var prisma = (new PrismaClient({})).$extends(OnuPrismaExtensions)

export async function memberWeeklyStreakUpdate(c: Client, weeklyStreakUpdateMessage: OnuKafkaTypes.QuestTracker.WeeklyStreakUpdateMessage) {

  var guild = await c.guilds.fetch(weeklyStreakUpdateMessage.discordGuildId)
  var dbGuild = await prisma.discordGuild.findUnique({where: {discordId: weeklyStreakUpdateMessage.discordGuildId}})
  if (!dbGuild) {return}
  if (!dbGuild.questChannelId) {return}
  var channel = await guild.channels.fetch(dbGuild.questChannelId)
  if (!channel) {return}
  var dbMember = await prisma.member.findUnique({
    where: {
      id: weeklyStreakUpdateMessage.memberId
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

  // create variables with day names based on streak start day
  var streakStartDay = weeklyStreakUpdateMessage.streakStartDay
  
  // create array of day numbers based on streak start day
  var streakDays = [streakStartDay]
  for (var i = 1; i < 7; i++) {
    streakDays.push((streakStartDay + i) % 7)
  }

  var streakDaysAcheived = []
  streakDaysAcheived.push(weeklyStreakUpdateMessage.day1)
  streakDaysAcheived.push(weeklyStreakUpdateMessage.day2)
  streakDaysAcheived.push(weeklyStreakUpdateMessage.day3)
  streakDaysAcheived.push(weeklyStreakUpdateMessage.day4)
  streakDaysAcheived.push(weeklyStreakUpdateMessage.day5)
  streakDaysAcheived.push(weeklyStreakUpdateMessage.day6)
  streakDaysAcheived.push(weeklyStreakUpdateMessage.day7)

  // create array of day names based on streakDays array
  var streakDayNames = []
  for (var i = 0; i < 7; i++) {
    switch (streakDays[i]) {
      case 0:
        streakDayNames.push('Sunday')
        break
      case 1:
        streakDayNames.push('Monday')
        break
      case 2:
        streakDayNames.push('Tuesday')
        break
      case 3:
        streakDayNames.push('Wednesday')
        break
      case 4:
        streakDayNames.push('Thursday')
        break
      case 5:
        streakDayNames.push('Friday')
        break
      case 6:
        streakDayNames.push('Saturday')
        break
    }
  }

  var description = `Congratulations ${member.user.username}! You have achieved a streak of ${weeklyStreakUpdateMessage.streakDays} days!`

  // append streak days to description
  description += '\n\n'
  description += 'Your streak days are: ' + '\n'
  for (var i = 0; i < 7; i++) {
    description += `${streakDayNames[i]}: ${streakDaysAcheived[i] ? '✅' : ''}` + '\n'
  }

  var streakEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`Weekly Streak Update!`)
    .setDescription(description)
    .addFields(
      // add exp fields
      { name: 'Total EXP', value: weeklyStreakUpdateMessage.currentExp.toString(), inline: true },
      { name: 'New EXP', value: weeklyStreakUpdateMessage.newExpAdded.toString(), inline: true },
    )

  var message = `${member}`

  await (channel as any).send({content: message, embeds: [streakEmbed]})
}