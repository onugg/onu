
import { prisma } from '@onu/prisma'
import { Guild, GuildMember } from 'discord.js';
import { AddOrUpdateMemberAndUser } from './member';

export async function addGuildOrUpdate (guild: Guild) {
  prisma.discordGuild.createIfNotExistsAndEmitEvent({
    where: {discordId: guild.id}, 
    create: {
      discordId: guild.id,
      name: guild.name,
      botInstallDate: new Date(),
      botInstalled: true
    },
    update: {
      name: guild.name,
      botInstallDate: new Date(),
      botInstalled: true
    }
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
}

export async function removeGuild(guild: Guild) {
  await prisma.discordGuild.deleteIfExistsAndEmitEvent({where: {discordId: guild.id}})
  console.log(`Guild [${guild.name}] removed from database`)

  // TO DO: Members are deleted buy orphaned users won't be deleted
}