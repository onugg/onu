import { Prisma, PrismaClient } from "@prisma/client";
import * as extensions from "./extensions";
// import { startEventReceivingWebServer, eventEmitter } from "@onu/events";
//import * as analytics from './analytics';
import { eventEmitter } from "@onu/events";
export * from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

var eventEmitFunction: Function = eventEmitter({
  brokerUrl: `${process.env.KNATIVE_BROKER_URL!}${process.env
    .KUBERNETES_NAMESPACE!}/database`,
}).emitEvent;

export const OnuPrismaExtensions = {
  model: {
    // DISCORD
    discordMember: {
      async createIfNotExistsAndEmitEvent(
        discordMemberCreateArgs: Prisma.DiscordMemberCreateArgs
      ) {
        return extensions.discord.member.createIfNotExists(
          eventEmitFunction,
          discordMemberCreateArgs
        );
      },
      async deleteIfExistsAndEmitEvent(
        discordMemberDeleteArgs: Prisma.DiscordMemberDeleteArgs
      ) {
        return extensions.discord.member.deleteIfExists(
          eventEmitFunction,
          discordMemberDeleteArgs
        );
      },
    },
    discordUser: {
      async createIfNotExistsAndEmitEvent(
        discordUserUpsertArgs: Prisma.DiscordUserUpsertArgs
      ) {
        return extensions.discord.user.createOrUpdateIfNotExists(
          eventEmitFunction,
          discordUserUpsertArgs
        );
      },
      async deleteIfExistsAndEmitEvent(
        discordUserDeleteArgs: Prisma.DiscordUserDeleteArgs
      ) {
        return extensions.discord.user.deleteIfExists(
          eventEmitFunction,
          discordUserDeleteArgs
        );
      },
    },
    discordGuild: {
      async createIfNotExistsAndEmitEvent(
        discordGuildUpsertArts: Prisma.DiscordGuildUpsertArgs
      ) {
        return extensions.discord.guild.createOfNotExistsOrUpdateAndEmitEvent(
          eventEmitFunction,
          discordGuildUpsertArts
        );
      },
      async deleteIfExistsAndEmitEvent(
        discordGuildDeleteArgs: Prisma.DiscordGuildDeleteArgs
      ) {
        return extensions.discord.guild.deleteIfExists(
          eventEmitFunction,
          discordGuildDeleteArgs
        );
      },
    },

    // MAIN
    community: {
      async createIfNotExistsAndEmitEvent(
        communityCreateArgs: Prisma.CommunityCreateArgs
      ) {
        return extensions.main.community.createAndEmitEvent(
          eventEmitFunction,
          communityCreateArgs
        );
      },
    },

    // QUEST
    memberQuestRecord: {
      async updateAndEmitLevelUpEvent(
        memberQuestRecordUpdateArgs: Prisma.MemberQuestRecordUpdateArgs
      ) {
        return extensions.quests.memberQuestRecord.updateAndEmitLevelUpEvent(
          eventEmitFunction,
          memberQuestRecordUpdateArgs
        );
      },
    } /*,

    // ANALYTICS
    memberQuestRecordDailySnapshot: {
      async getCommunityRankedAnalytics(communityId: string) {
        return analytics.getCommunityRankedAnalytics(communityId)
      }
    }*/,
  },
};
