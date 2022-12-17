const { Client } = require('discord.js');
import * as intents from './intents'
//import { trpc } from '@onu/trpcclient'
import * as eventTasks from './eventTasks'
import * as dotenv from 'dotenv';
import { User, GuildMember, Guild } from 'discord.js';
dotenv.config();


async function start() {
  const c = new Client({ intents: intents.gatewayIntents });

  // Bot startup event
  c.on("ready", function(){
    eventTasks.ProcessCache(c)                            // synchronise the cache with the database on startup of bot
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

  c.on("userUpdate", function(oldUser: User, newUser: User){
    eventTasks.UpdateUser(oldUser, newUser)
  })

  c.on("guildMemberUpdate", function(_oldMember: GuildMember, newMember: GuildMember){
    eventTasks.AddOrUpdateMemberAndUser(newMember)
  })

  c.login(process.env["DISCORD_TOKEN"]);
}

start();