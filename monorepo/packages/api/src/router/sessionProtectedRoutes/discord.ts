import { brokers, eventEmitter } from "@onu/events";
import { createTRPCRouter, sessionProtectedProcedure } from "../../trpc";

import SharedDiscord from "../../shared/discord";
import { prisma } from "@onu/database";
import { z } from "zod";

var emit: Function = eventEmitter({
  brokerUrl: `${process.env.KNATIVE_BROKER_URL!}${process.env
    .KUBERNETES_NAMESPACE!}/database`,
}).emitEvent;
var sharedDiscord: any = SharedDiscord({ emit: emit, prisma: prisma });

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
  createDiscordGuild: sessionProtectedProcedure
    .input(
      z.object({
        name: z.string(),
        discordId: z.string(),
        communityId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return sharedDiscord.createDiscordGuild({
        name: input.name,
        discordId: input.discordId,
        communityId: input.communityId,
      });
    }),

  getDiscordGuildTextChannels: sessionProtectedProcedure
    .input(
      z.object({
        guildId: z.string(),
      })
    )
    .query(async ({ input }) => {
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
    }),

  getDiscordGuildFromDiscordAPI: sessionProtectedProcedure
    .input(
      z.object({
        guildId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const response = await fetch(
        `https://discord.com/api/guilds/${input.guildId}`,
        {
          headers: {
            authorization: `Bot ${process.env.DISCORD_CLIENT_ID}`,
          },
        }
      );
      const guild = await response.json();
      return guild;
    }),

  getDiscordOwnedGuilds: sessionProtectedProcedure
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

  getDiscordUnusedOwnedGuilds: sessionProtectedProcedure
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

  getDiscordBySlug: sessionProtectedProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      console.log(input.slug);
      const community = await ctx.prisma.community.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          discordGuild: true,
        },
      });
      console.log(community?.discordGuild);
      return community;
    }),

  updateDiscordWelcomeChannelId: sessionProtectedProcedure
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
