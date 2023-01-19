
import { Client, Events, PartialGuildMember, Message } from 'discord.js';
import * as intents from './intents'
import * as eventTasks from './eventTasks'
import * as messageHandlers from './messageHandlers'
import { GuildMember, Guild } from 'discord.js';
import { OnuKafka } from '@onu/kafka';
import * as OnuKafkaTypes from "@onu/kafka/interfaces";
import { discordBotKafkaOptions } from '@onu/config';
import * as dotenv from 'dotenv';
dotenv.config();

const c = new Client({ intents: intents.gatewayIntents });

async function checkIfGuildInShard(guildId: string) {
  const guilds = c.guilds.cache.map(guild => guild.id)
  if (guilds.includes(guildId)) {return true}
  return false
}

async function messageRouter(topicName: string, message: any) {
  console.log("Received message on topic: " + topicName)
  
  if (topicName === OnuKafkaTypes.Prisma.DiscordGuildCreatedTopic) {
    var discordGuildCreatedMessage: OnuKafkaTypes.Prisma.DiscordGuildMessage = JSON.parse(message)
    if (!(await checkIfGuildInShard(discordGuildCreatedMessage.discordId))) {return}
    messageHandlers.discordGuild.created(c, discordGuildCreatedMessage)
    return
  }


  if (topicName === OnuKafkaTypes.Prisma.DiscordGuildUpdatedTopic) {
    var discordGuildUpdatedMessage: OnuKafkaTypes.Prisma.DiscordGuildUpdatedMessage = JSON.parse(message)
    if (!(await checkIfGuildInShard(discordGuildUpdatedMessage.discordId))) {return}
    if (discordGuildUpdatedMessage.updatedFields.includes('communityId')) {
      messageHandlers.discordGuild.communityIdUpdated(c, discordGuildUpdatedMessage)
      return
    }
    return
  }

  if (topicName === OnuKafkaTypes.Prisma.QuestMemberLevelUp) {
    var questMemberLevelUpMessage: OnuKafkaTypes.Prisma.QuestMemberLevelUpMessage = JSON.parse(message)
    if (!(await checkIfGuildInShard(questMemberLevelUpMessage.discordGuildId))) {return}
    messageHandlers.quests.memberLevelUp(c, questMemberLevelUpMessage)
    return
  }

  if (topicName.startsWith("quest-tracker.quests")) {
    var questAchievedMessage: OnuKafkaTypes.QuestTracker.QuestAchievedMessage = JSON.parse(message)
    if (!(await checkIfGuildInShard(questAchievedMessage.discordGuildId))) {return}
    messageHandlers.quests.achieved(c, questAchievedMessage)
    return
  }

  if (topicName === OnuKafkaTypes.QuestTracker.WeeklyStreakUpdateTopic) {
    var weeklyStreakUpdateMessage: OnuKafkaTypes.QuestTracker.WeeklyStreakUpdateMessage = JSON.parse(message)
    console.log(weeklyStreakUpdateMessage)
    if (!(await checkIfGuildInShard(weeklyStreakUpdateMessage.discordGuildId))) {return}
      messageHandlers.streak.memberWeeklyStreakUpdate(c, weeklyStreakUpdateMessage)
    return
  }

  console.log(`Unknown topic: ${topicName}`)
}

async function start() {

  // each bot will be its own kafka consumer
  discordBotKafkaOptions.clientId = `${discordBotKafkaOptions.clientId}-${c.shard?.ids.join("-")}`
  discordBotKafkaOptions.groupId = `${discordBotKafkaOptions.groupId}-${c.shard?.ids.join("-")}`

  var k = OnuKafka(discordBotKafkaOptions)

  // Bot startup event
  c.on("ready", function(){
    eventTasks.batch.ProcessCache(c)                            // synchronise the cache with the database on startup of bot
    eventTasks.shard.emitShardReady(k.emitEvent, c)             // emit a message to Kafka that the shard is ready  
  })

  // Message Sent
  c.on(Events.MessageCreate, function(message: Message){
    if (message.author.id != c.user!.id) {eventTasks.message.messageCreate(k.emitEvent, message)}
  })
  
  // Member events
  c.on(Events.GuildMemberAdd, function(member: GuildMember){
    if (member.user.id != c.user!.id) {eventTasks.member.AddOrUpdateMemberAndUser(member)}           // adds/updates the user / member in the database
  })

  c.on(Events.GuildMemberRemove, function(member: GuildMember | PartialGuildMember){
    if (member.user.id != c.user!.id) {eventTasks.member.RemoveMember(member)}                       // removes the member from the database
  })

  // Guild events
  c.on(Events.GuildCreate, function(guild: Guild){
    console.log("Received event GuildCreate")
    eventTasks.guild.addGuildOrUpdate(guild)                            // adds the guild to the database when the bot is added to a new guild
    eventTasks.guild.verifyGuildSetup(guild)
  });

  c.on(Events.GuildDelete, function(guild: Guild){
    eventTasks.guild.removeGuild(guild)                         // removes the guild from the database when the bot is removed from a guild
  })

  /*c.on(Events.UserUpdate, function(_oldUser: User | PartialUser, newUser: User){
    if (newUser.id != c.user!.id) {eventTasks.user.AddOrUpdateUser(newUser)}               // when a user changes their details update the database
  })*/

  c.on(Events.GuildMemberUpdate, function(_oldMember: GuildMember | PartialGuildMember, newMember: GuildMember){
    if (newMember.user.id != c.user!.id) {eventTasks.member.AddOrUpdateMemberAndUser(newMember)}        // when a member changes their details update the database
  })

  k.registerConsumers([
    {callback: messageRouter, topic: OnuKafkaTypes.QuestTracker.WeeklyStreakUpdateTopic},
    {callback: messageRouter, topic: OnuKafkaTypes.Prisma.DiscordGuildCreatedTopic},
    {callback: messageRouter, topic: OnuKafkaTypes.Prisma.DiscordGuildUpdatedTopic},
    {callback: messageRouter, topic: OnuKafkaTypes.Prisma.QuestMemberLevelUp},
    {callback: messageRouter, topic: OnuKafkaTypes.QuestTracker.DiscordMessagesSentQuestAchievedTopic},
  ])

  await k.startProducer()

  c.login(process.env["DISCORD_TOKEN"]);
}

start();