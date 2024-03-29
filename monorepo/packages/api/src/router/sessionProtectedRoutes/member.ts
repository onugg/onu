import { z } from "zod";
import { createTRPCRouter, sessionProtectedProcedure } from "../../trpc";

export const memberRouter = createTRPCRouter({
  // Create Member
  createMember: sessionProtectedProcedure
    .input(
      z.object({
        communityId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const member = await ctx.prisma.member.create({
        data: {
          communityId: input.communityId,
          userId: input.userId,
          role: "owner",
        },
      });
      return member;
    }),

  getMemberByCommunityIdAndUserId: sessionProtectedProcedure
    .input(
      z.object({
        communityId: z.string(),
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const member = await ctx.prisma.member.findUnique({
        where: {
          userId_communityId: {
            userId: input.userId,
            communityId: input.communityId,
          },
        },
      });
      return member;
    }),
});
