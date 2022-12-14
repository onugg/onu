import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import DiscordProvider, { DiscordProfile } from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope:
            "identify email guilds applications.commands.permissions.update",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account}) {
      if (account) {
        token.accessToken = account.access_token;
        token.tokenType = account.token_type;
      }
      return token;
    },
    async session({ session, token }) {
      if (session) {
        session.accessToken = token.accessToken as string;
        session.tokenType = token.tokenType as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  }
};
export default NextAuth(authOptions);