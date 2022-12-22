
import { Client, Events, Message, PartialGuildMember, PartialUser } from 'discord.js';
//const { Kafka } = require('kafkajs')
import * as OnuKafkaTypes from '@onu/kafka/interfaces';
//import { ShardStartedMessage } from '@onu/kafka/apps/discordBot';
import * as intents from './intents'
//import { trpc } from '@onu/trpcclient'
import * as eventTasks from './eventTasks'

import { User, GuildMember, Guild } from 'discord.js';
//import { Consumer, EachMessagePayload, ITopicConfig, Producer } from 'kafkajs';

import { OnuKafka } from '@onu/kafka';

import { discordBotKafkaOptions } from '@onu/config';

import * as dotenv from 'dotenv';
dotenv.config();

async function test(test: string) {
  console.log(test)
}

async function start() {
  const c = new Client({ intents: intents.gatewayIntents });

  // Bot startup event
  c.on("ready", function(){
    eventTasks.batch.ProcessCache(c)                            // synchronise the cache with the database on startup of bot
    eventTasks.shard.emitShardReady(k.emitEvent, c)             // emit a message to Kafka that the shard is ready           
  })
  
  // Member events
  c.on(Events.GuildMemberAdd, function(member: GuildMember){
    eventTasks.member.AddOrUpdateMemberAndUser(member)           // adds/updates the user / member in the database
    eventTasks.member.emitMemberAddedToGuild(                    // emit event user added to guild
      k.emitEvent,
      {
       discordGuildId: member.guild.id,
       discordUserId: member.user.id
      }
    )
    eventTasks.welcome.registerWelcomeThread(c, member)              // register the welcome thread if the guild has this configured
  })

  c.on(Events.MessageCreate, function(message: Message){
    eventTasks.welcome.checkIfMessageIsWelcome(k.emitEvent, message)          // check if the message is a welcome message and if so trigger event
  })



  c.on(Events.ThreadMembersUpdate, function(addedMembers, removedMembers, thread){
    console.log("threadMembersUpdate")
    console.log(addedMembers, removedMembers, thread)
  })

  c.on(Events.GuildMemberRemove, function(member: GuildMember | PartialGuildMember){
    eventTasks.member.RemoveMember(member)                       // removes the member from the database
    eventTasks.member.emitMemberLeftGuild(                       // emit event user left the guild
      k.emitEvent,
      {
       discordGuildId: member.guild.id,
       discordUserId: member.user.id
      }
    )
  })

  // Guild events
  c.on(Events.GuildCreate, function(guild: Guild){
    eventTasks.guild.addGuild(guild)                            // adds the guild to the database when the bot is added to a new guild
  });

  c.on(Events.GuildDelete, function(guild: Guild){
    eventTasks.guild.removeGuild(guild)                         // removes the guild from the database when the bot is removed from a guild
  })

  c.on(Events.UserUpdate, function(_oldUser: User | PartialUser, newUser: User){
    eventTasks.user.AddOrUpdateUser(newUser)               // when a user changes their details update the database
  })

  c.on(Events.GuildMemberUpdate, function(_oldMember: GuildMember | PartialGuildMember, newMember: GuildMember){
    eventTasks.member.AddOrUpdateMemberAndUser(newMember)        // when a member changes their details update the database
  })

  var k = OnuKafka(discordBotKafkaOptions)

  await k.configureTopics([
    OnuKafkaTypes.DiscordBot.ShardStartedTopic,
    OnuKafkaTypes.DiscordBot.MemberAddedToGuildTopic,
    OnuKafkaTypes.DiscordBot.MemberLeftGuildTopic,
    OnuKafkaTypes.DiscordBot.MemberWelcomeTopic
  ])

  await k.registerConsumers([
    {
      callback: test,
      topic: OnuKafkaTypes.DiscordBot.ShardStartedTopic
    },
    {
      callback: test,
      topic: OnuKafkaTypes.DiscordBot.MemberLeftGuildTopic
    },
    {
      callback: test,
      topic: OnuKafkaTypes.DiscordBot.MemberAddedToGuildTopic
    },
    {
      callback: test,
      topic: OnuKafkaTypes.DiscordBot.MemberWelcomeTopic
    }
  ])

  await k.startProducer()

  c.login(process.env["DISCORD_TOKEN"]);
}

start();