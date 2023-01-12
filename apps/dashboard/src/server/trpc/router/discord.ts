import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import type { DiscordGuild } from "@/types";

export const discordRouter = router({

  createDiscordGuild: protectedProcedure
  .input(
    z.object({
      name: z.string(),
      discordId: z.string(),
      communityId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const guild = await ctx.prisma.discordGuild.create({
      data: {
        name: input.name,
        discordId: input.discordId,
        community: {
          connect: {
            id: input.communityId,
          },
        },
      },
    });
    return guild;
  }),

  getDiscordOwnedGuilds: protectedProcedure
    .input(
      z.object({
        accessToken: z.string().nullable().optional(),
        tokenType: z.string().nullable().optional(),
      })
    )
    .query(async ({ input }) => {
      if (!input.accessToken || !input.tokenType) {
        return [];
      } else {
        const response = await fetch(
          "https://discord.com/api/users/@me/guilds",
          {
            headers: {
              authorization: `${input.tokenType} ${input.accessToken}`,
            },
          }
        );
        const guilds = await response.json();

        if (guilds) {
          const ownedGuilds = guilds.filter(
            (guild: DiscordGuild) => guild.owner
          );
          return ownedGuilds;
        }
        console.log("No Guilds Found");
      }
    }),
});
