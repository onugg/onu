import { createTRPCRouter, sessionProtectedProcedure } from "../../trpc";

export const authRouter = createTRPCRouter({
  getSession: sessionProtectedProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
});
