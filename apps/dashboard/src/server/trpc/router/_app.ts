import { router } from "../trpc";
import { authRouter } from "./auth";
import { communityRouter } from "./community";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  community: communityRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
