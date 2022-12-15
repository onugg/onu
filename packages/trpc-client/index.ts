import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { AppRouter as DiscordBotAppRouter } from '../../apps/discord-bot/src/trpcServer'
import { AppRouter as DashboardAppRouter } from '../../apps/dashboard/src/server/trpc/router/_app'

export type discordBotAppRouter = DiscordBotAppRouter
export type dashboardAppRouter = DashboardAppRouter

const discordBotClient = createTRPCProxyClient<DiscordBotAppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
      maxURLLength: 2083
    })
  ]
})

const dashboardAppClient = createTRPCProxyClient<dashboardAppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
      maxURLLength: 2083
    })
  ]
})

export const trpc = {
  discord: discordBotClient,          // alias discordBot as discord
  user: dashboardAppClient            // alias dashboardApp as user
}