import { z } from "zod";
import { createTRPCRouter, sessionProtectedProcedure } from "../../trpc";

export const accountRouter = createTRPCRouter({
  // get account by userId, type, and provider
  getAccountByUserIdAndProvider: sessionProtectedProcedure
    .input(
      z.object({
        userId: z.string().nullable().optional(),
        provider: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (input.userId) {
        const account = await ctx.prisma.account.findFirst({
          where: {
            userId: input.userId,
            type: "oauth",
            provider: input.provider,
          },
        });
        return account;
      }
      return null;
    }),
});
