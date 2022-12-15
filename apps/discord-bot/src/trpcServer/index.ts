import { initTRPC } from '@trpc/server';
import { discordUserRouter } from './routers/discordUser'

const t = initTRPC.create()

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;

const appRouter = t.router({
  discordUser: discordUserRouter,
})

export type AppRouter = typeof appRouter