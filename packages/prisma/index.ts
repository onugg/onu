import { PrismaClient, Prisma } from '@prisma/client';
import { OnuKafka } from '@onu/kafka';
import { prismaKafkaOptions } from '@onu/config';
import * as extensions from './extensions';

const prisma_base = new PrismaClient(); 

var k = OnuKafka(prismaKafkaOptions)

k.startProducer()

var prisma = prisma_base.$extends({
  model: {

    // DISCORD
    discordMember: {
      async createIfNotExistsAndEmitEvent(discordMemberCreateArgs: Prisma.DiscordMemberCreateArgs) {
        return extensions.discord.member.createAndEmitEventIfNotExists(k.emitEvent, discordMemberCreateArgs)
      },
      async deleteIfExistsAndEmitEvent(discordMemberDeleteArgs: Prisma.DiscordMemberDeleteArgs) {
        return extensions.discord.member.deleteAndEmitEventIfExists(k.emitEvent, discordMemberDeleteArgs)
      }
    },
    discordUser: {
      async createIfNotExistsAndEmitEvent(discordUserUpsertArgs: Prisma.DiscordUserUpsertArgs) {
        return extensions.discord.user.createOrUpdateAndEmitEventIfNotExists(k.emitEvent, discordUserUpsertArgs)
      },
      async deleteIfExistsAndEmitEvent(discordUserDeleteArgs: Prisma.DiscordUserDeleteArgs) {
        return extensions.discord.user.deleteAndEmitEventIfExists(k.emitEvent, discordUserDeleteArgs)
      }
    },
    discordGuild: {
      async createIfNotExistsAndEmitEvent(discordGuildUpsertArts: Prisma.DiscordGuildUpsertArgs) {
        return extensions.discord.guild.createOfNotExistsOrUpdateAndEmitEvent(k.emitEvent, discordGuildUpsertArts)
      },
      async deleteIfExistsAndEmitEvent(discordGuildDeleteArgs: Prisma.DiscordGuildDeleteArgs) {
        return extensions.discord.guild.deleteAndEmitEventIfExists(k.emitEvent, discordGuildDeleteArgs)
      }
    }
  }
})

export { prisma };


