
import { Guild, GuildMember, Client, Channel, ChannelType, TextChannel } from 'discord.js';
import { AddOrUpdateMemberAndUser } from './member';
import { PrismaClient, OnuPrismaExtensions } from '@onu/prisma'

var prisma = (new PrismaClient({})).$extends(OnuPrismaExtensions)

export async function verifyGuildSetup(guild: Guild) {
  var dbGuild = await prisma.discordGuild.findUnique({where: {discordId: guild.id}})
  if (!dbGuild) {
    await addGuildOrUpdate(guild)
  }
  if (dbGuild && dbGuild.guildInitialSetupRun === false && dbGuild.communityId != null) {
    await setupGuild(guild.client, guild.id)
  }
}

export async function setupGuild (c: Client, discordId: string) {
  var dbGuild = (await prisma.discordGuild.findUnique({where: {discordId: discordId}}))!
  
  if (!dbGuild) {return}

  var guild = c.guilds.cache.get(dbGuild.discordId)!

  // community id isn't set for the guild - send a message saying the guild isn't linked to a community
  if (dbGuild.communityId === null && dbGuild.communityUnlinkedMessageSent === false) {
    await prisma.discordGuild.update({where: {discordId: dbGuild.discordId}, data: {communityUnlinkedMessageSent: true}})
    var guild = c.guilds.cache.get(dbGuild.discordId)!
    var textChannels = await guild.channels.cache.filter((channel: Channel) => channel.type === ChannelType.GuildText)
    var textChannelOne = textChannels.first() as TextChannel
    textChannelOne.send(`This guild is not linked to a community. Please add this guild to a community in the web app`)
    return
  }

  if (dbGuild.communityId != null && dbGuild.guildInitialSetupRun === false) {

    var dbCommunity = (await prisma.community.findUnique({where: {id: dbGuild.communityId}}))!

    var guild = c.guilds.cache.get(dbGuild.discordId)!
    guild.members.fetch()
    .then((members) => {
      members.forEach((member: GuildMember) => {
        AddOrUpdateMemberAndUser(member).then(() => {})
      })
      console.log(`Guild [${guild.name}] synchronised with database`)
    })

    await prisma.discordGuild.update({where: {discordId: dbGuild.discordId}, data: {
      guildInitialSetupRun: true,
      botInstallDate: new Date(),
      botInstalled: true
    }})

    var textChannels = await guild.channels.cache.filter((channel: Channel) => channel.type === ChannelType.GuildText)
    var textChannelOne = textChannels.first() as TextChannel
    textChannelOne.send(`This guild is connected to the community [${dbCommunity.name}].`)
  }
}

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
  })
}

export async function removeGuild(guild: Guild) {
  await prisma.discordGuild.deleteIfExistsAndEmitEvent({where: {discordId: guild.id}})
  console.log(`Guild [${guild.name}] removed from database`)

  // TO DO: Members are deleted buy orphaned users won't be deleted
}