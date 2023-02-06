import { z } from "zod";
import { apiKeyProtectedProcedure, createTRPCRouter, publicProcedure } from "../../trpc";
import { eventEmitter, brokers } from "@onu/events"
import SharedDiscord from "../../shared/discord"
import { prisma } from "@onu/database"

var emit: Function = eventEmitter({brokerUrl: `${process.env.KNATIVE_BROKER_URL!}${process.env.KUBERNETES_NAMESPACE!}/database`}).emitEvent
var sharedDiscord: any = SharedDiscord({emit: emit, prisma: prisma})

export const test = createTRPCRouter({
  createDiscordGuild: apiKeyProtectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        discordId: z.string().optional(),
        communityId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return sharedDiscord.createDiscordGuild({
        name: input.name,
        discordId: input.discordId,
        communityId: input.communityId,
      })
    })
});
