import { router } from "../trpc";
import { accountRouter } from "./account";
import { authRouter } from "./auth";
import { communityRouter } from "./community";
import { discordRouter } from "./discord";
import { memberRouter } from "./member";
import { userRouter } from "./user";

export const appRouter = router({
  account: accountRouter,
  auth: authRouter,
  community: communityRouter,
  discord: discordRouter,
  member: memberRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
