import { createTRPCRouter, sessionProtectedProcedure } from "../../trpc";

export const userRouter = createTRPCRouter({
  // Get User By Session
  getUserBySession: sessionProtectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    return user;
  }),
});
