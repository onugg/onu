const { Client } = require('discord.js');
import { Guild, GuildMember } from 'discord.js';
import { PrismaClient } from '@onu/prisma'
import { AddOrUpdateMemberAndUser } from './member';

var prisma = new PrismaClient()


// runs on startup to sync the cache with the database
export async function ProcessCache (client: typeof Client) {
  client.guilds.cache.map((guild: Guild) => {
    prisma.discordGuild.upsert({
      where: {discordId: guild.id},
      update: {name: guild.name, botInstalled: true},
      create: {discordId: guild.id, name: guild.name, botInstallDate: new Date(), botInstalled: true}
    }).then((dbGuild) => {
      if (dbGuild) {
        guild.members.fetch()
        .then((members) => {
          members.forEach((member: GuildMember) => {
            AddOrUpdateMemberAndUser(member).then(() => {})
          })
          console.log(`Guild [${guild.name}] synchronised with database`)
        })
      }
    })
  })

    
      
  

  

}