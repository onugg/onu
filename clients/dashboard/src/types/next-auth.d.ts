import NextAuth from "next-auth"

declare module "next-auth" {

  interface Session {
    accessToken: string
    tokenType: string
    profile: DiscordProfile
  }
}