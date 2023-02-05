import { createTRPCRouter } from "./trpc";
import { accountRouter } from "./router/account";
import { authRouter } from "./router/auth";
import { communityRouter } from "./router/community";
import { discordRouter } from "./router/discord";
import { memberRouter } from "./router/member";
import { userRouter } from "./router/user";

export const appRouter = createTRPCRouter({
  account: accountRouter,
  auth: authRouter,
  community: communityRouter,
  discord: discordRouter,
  member: memberRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
