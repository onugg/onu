import { PrismaClient, Prisma } from '@prisma/client';
import { OnuKafka } from '@onu/kafka';
import { prismaKafkaOptions } from '@onu/config';
import * as extensions from './extensions';
// import * as analytics from './analytics';

var k = OnuKafka(prismaKafkaOptions)

k.startProducer()

const OnuPrismaExtensions = {
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
    },

    // MAIN
    community: {
      async createIfNotExistsAndEmitEvent(communityCreateArgs: Prisma.CommunityCreateArgs) {
        return extensions.main.community.createAndEmitEvent(k.emitEvent, communityCreateArgs)
      }
    },

    // QUEST
    memberQuestRecord: {
      async updateAndEmitLevelUpEvent(memberQuestRecordUpdateArgs: Prisma.MemberQuestRecordUpdateArgs) {
        return extensions.quests.memberQuestRecord.updateAndEmitLevelUpEvent(k.emitEvent, memberQuestRecordUpdateArgs)
      }
    }

    // ANALYTICS
    // memberQuestRecordDailySnapshot: {
    //   async getCommunityRankedAnalytics(communityId: string) {
    //     return analytics.getCommunityRankedAnalytics(communityId)
    //   }
    // }
  }
}

export { OnuPrismaExtensions, PrismaClient }

