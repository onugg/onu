import { string, z } from "zod";
import { createTRPCRouter, sessionProtectedProcedure } from "../../trpc";

export const communityRouter = createTRPCRouter({
  // Create Community
  createCommunity: sessionProtectedProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string(),
        imageUrl: string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const community = await ctx.prisma.community.create({
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description,
          image: input.imageUrl,
        },
      });
      return community;
    }),

  // Get Community By Slug
  getCommunityBySlug: sessionProtectedProcedure
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
      });
      return community;
    }),

  // Get Owned Communities
  getOwnedCommunitiesByUserId: sessionProtectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const communities = await ctx.prisma.community.findMany({
        where: {
          members: {
            some: {
              userId: input.userId,
              role: "owner",
            },
          },
        },
      });
      return communities;
    }),

  getMemberCommunitiesByUserId: sessionProtectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const communities = await ctx.prisma.community.findMany({
        where: {
          members: {
            some: {
              userId: input.userId,
              role: "member",
            },
          },
        },
      });
      return communities;
    }),
});
