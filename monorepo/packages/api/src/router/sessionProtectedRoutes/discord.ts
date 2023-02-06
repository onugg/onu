import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const discordGuild = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  owner: z.boolean(),
  permissions: z.number(),
  icon_url: z.string(),
  botInGuild: z.boolean(),
  memberType: z.string(),
});

export const discordGuildChannel = z.object({
  id: z.string(),
  name: z.string(),
  type: z.number(),
  position: z.number(),
  permission_overwrites: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      allow: z.string(),
      deny: z.string(),
    })
  ),
  parent_id: z.string().nullable(),
  guild_id: z.string(),
});

export type DiscordGuildChannel = z.infer<typeof discordGuildChannel>;

export type DiscordGuild = z.infer<typeof discordGuild>;

export const discordRouter = createTRPCRouter({
  createDiscordGuild: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        discordId: z.string().optional(),
        communityId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!input.name) {
        console.log("No Name in createDiscordGuild");
        return;
      }
      if (!input.discordId) {
        console.log("No Discord ID in createDiscordGuild");
        return;
      }
      if (!input.communityId) {
        console.log("No Community ID in createDiscordGuild");
        return;
      } else {
        const guild = await ctx.prisma.discordGuild.create({
          data: {
            name: input.name,
            discordId: input.discordId,
            communityId: input.communityId,
          },
        });
        return guild;
      }
    }),

  getDiscordGuildTextChannels: protectedProcedure
    .input(
      z.object({
        accessToken: z.string().nullable().optional(),
        tokenType: z.string().nullable().optional(),
        guildId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (!input.accessToken || !input.tokenType) {
        console.log("No Access Token or Token Type");
        return [];
      }
      if (!input.guildId) {
        console.log("No Guild ID");
        return [];
      } else {
        const response = await fetch(
          `https://discord.com/api/guilds/${input.guildId}/channels`,
          {
            headers: {
              authorization: `Bot ${process.env.DISCORD_CLIENT_ID}`,
            },
          }
        );
        const channels = await response.json();

        if (channels) {
          const textChannels = channels.filter(
            (channel: DiscordGuildChannel) => channel.type === 0
          );
          return textChannels;
        } else {
          console.log("No Channels Found");
        }
      }
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

  getDiscordUnusedOwnedGuilds: protectedProcedure
    .input(
      z.object({
        accessToken: z.string().nullable().optional(),
        tokenType: z.string().nullable().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
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

          const ownedGuildIds = ownedGuilds.map(
            (guild: DiscordGuild) => guild.id
          );
          const ownedGuildIdsUsed = await ctx.prisma.discordGuild.findMany({
            select: {
              discordId: true,
            },
            where: {
              AND: [
                { NOT: { communityId: null } },
                {
                  discordId: {
                    in: ownedGuildIds,
                  },
                },
              ],
            },
          });

          console.log(ownedGuildIdsUsed);

          const ownedGuildsThatAreNotBeingUsed = ownedGuilds.filter(
            (guild: DiscordGuild) =>
              !ownedGuildIdsUsed.some(
                (usedGuild) => usedGuild.discordId === guild.id
              )
          );

          return ownedGuildsThatAreNotBeingUsed;
        }
        console.log("No Guilds Found");
      }
    }),

  getDiscordBySlug: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const community = await ctx.prisma.community.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          discordGuild: true,
        },
      });
      return community;
    }),

  updateDiscordWelcomeChannelId: protectedProcedure
    .input(
      z.object({
        discordId: z.string(),
        welcomeChannelId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const guild = await ctx.prisma.discordGuild.update({
        where: {
          discordId: input.discordId,
        },
        data: {
          welcomeChannelId: input.welcomeChannelId,
        },
      });
      return guild;
    }),
});
