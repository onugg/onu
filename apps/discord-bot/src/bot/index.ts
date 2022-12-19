const { Client } = require('discord.js');
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
    eventTasks.ProcessCache(c)                            // synchronise the cache with the database on startup of bot
    eventTasks.emitShardReady(                            // emit a message to Kafka that the shard is ready
      k.emitEvent, 
      {
        shardId: c.guilds.cache.map((guild: Guild) => {return guild.id}), 
        guilds: c.shard?.ids[0]
      }
    )                
  })
  
  // Member events
  c.on("guildMemberAdd", function(member: GuildMember){
    eventTasks.AddOrUpdateMemberAndUser(member)           // adds/updates the user / member in the database
  })

  c.on("guildMemberRemove", function(member: GuildMember){
    eventTasks.RemoveMember(member)                       // removes the member from the database
  })

  // Guild events
  c.on("guildCreate", function(guild: Guild){
    eventTasks.addGuild(guild)                            // adds the guild to the database when the bot is added to a new guild
  });

  c.on("guildDelete", function(guild: Guild){
    eventTasks.removeGuild(guild)                         // removes the guild from the database when the bot is removed from a guild
  })

  c.on("userUpdate", function(_oldUser: User, newUser: User){
    eventTasks.AddOrUpdateUser(newUser)               // when a user changes their details update the database
  })

  c.on("guildMemberUpdate", function(_oldMember: GuildMember, newMember: GuildMember){
    eventTasks.AddOrUpdateMemberAndUser(newMember)        // when a member changes their details update the database
  })

  var k = OnuKafka(discordBotKafkaOptions)

  await k.configureTopics([
    OnuKafkaTypes.DiscordBot.ShardStartedTopic
  ])

  await k.registerConsumers([
    {
      callback: test,
      topic: OnuKafkaTypes.DiscordBot.ShardStartedTopic
    }
  ])

  await k.startProducer()

  c.login(process.env["DISCORD_TOKEN"]);
}

start();