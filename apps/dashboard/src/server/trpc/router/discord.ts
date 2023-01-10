import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import type { DiscordGuild } from "../../../types";

export const discordRouter = router({
  getDiscordOwnedGuilds: protectedProcedure
    .input(
      z.object({
        accessToken: z.string().nullable().optional(),
        tokenType: z.string().nullable().optional(),
      })
    )
    .query(async ({ input }) => {
      if (!input.accessToken || !input.tokenType) {
        console.log("No access token or token type provided.");
        return [];
      } else {
        console.log(
          "This is the accessToken Info",
          input.accessToken,
          input.tokenType
        );
        const response = await fetch(
          "https://discord.com/api/users/@me/guilds",
          {
            headers: {
              authorization: `${input.tokenType} ${input.accessToken}`,
            },
          }
        );
        const guilds = await response.json();

        if (guilds) {
            const ownedGuilds = guilds.filter((guild: DiscordGuild) => guild.owner);
            return ownedGuilds;
        } 
        console.log('No Guilds Found');
      }
    }),
});
