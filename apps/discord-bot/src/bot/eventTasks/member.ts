import { GuildMember, PartialGuildMember } from 'discord.js';
import { PrismaClient, OnuPrismaExtensions } from '@onu/prisma'
var prisma = (new PrismaClient({})).$extends(OnuPrismaExtensions)


// add a member and user to database if they join - will update if they already exist (e.g. user is in other guild already)
export async function AddOrUpdateMemberAndUser (member: GuildMember) {

  // create a community user and account if they don't exist
  var account = await prisma.account.findFirst({where: {provider: 'discord', providerAccountId: member.user.id}})
  if (!account) {
    var user = await prisma.user.create({
      data: {}
    })

    account = await prisma.account.create({
      data: {
        userId: user.id,
        type: 'oauth',
        provider: 'discord',
        providerAccountId: member.user.id,
      }
    })
  } else {
    var user = (await prisma.user.findFirst({where: {id: account.userId}}))!
  }


  prisma.discordUser.createIfNotExistsAndEmitEvent({
    where: {discordId: member.user.id},
    update: {name: member.user.username, discriminator: member.user.discriminator, userId: user.id},
    create: {discordId: member.user.id, name: member.user.username, discriminator: member.user.discriminator, userId: user.id}
  }).then((dbUser) => {
    prisma.discordGuild.findUnique({where: {discordId: member.guild.id}}).then((dbGuild) => {
      if (dbGuild) {
        prisma.discordMember.createIfNotExistsAndEmitEvent({data: {discordGuildId: dbGuild.id, discordUserId: dbUser!.id}}).then(() => {
          console.log(`Member [${member.user.username}] synchronised with database`)
        })
      }
    })
  })
}

// remove a member from the database if they leave
export async function RemoveMember (member: GuildMember | PartialGuildMember) {
  var guildInDb = await prisma.discordGuild.findUnique({where: {discordId: member.guild.id}})
  var userInDb = await prisma.discordUser.findUnique({where: {discordId: member.user.id}})

  if (guildInDb && userInDb) {
    await prisma.discordMember.deleteIfExistsAndEmitEvent({
      where: {discordUserId_discordGuildId: {discordUserId: userInDb.id, discordGuildId: guildInDb.id}}
    })
    console.log(`Member [${member.user.username}] removed from guild [${member.guild.name}]`)
  }
}