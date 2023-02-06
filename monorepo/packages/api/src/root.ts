import { createTRPCRouter } from "./trpc";
import { accountRouter } from "./router/sessionProtectedRoutes/account";
import { authRouter } from "./router/sessionProtectedRoutes/auth";
import { communityRouter } from "./router/sessionProtectedRoutes/community";
import { discordRouter } from "./router/sessionProtectedRoutes/discord";
import { memberRouter } from "./router/sessionProtectedRoutes/member";
import { userRouter } from "./router/sessionProtectedRoutes/user";

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
