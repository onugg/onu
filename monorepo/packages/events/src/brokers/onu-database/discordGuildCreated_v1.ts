import { z } from "zod";
import { Base } from '../../types'
import { SourceName } from '.'

export const Name = 'discord.guild.created'

export const dbDiscordGuild = z.object({
  id: z.string({}),
  discordId: z.string({}),
  name: z.string({})
})

export const MessageSchema = Base.extend({
  data: z.object({
    dbDiscordGuild: dbDiscordGuild
  })
})


export const EventLoader = (guild: z.infer<typeof dbDiscordGuild>): [string, string, z.infer<typeof MessageSchema>] => {
  return [
    SourceName,
    Name,
    MessageSchema.parse({
      version: 1,
      data: {
        dbDiscordGuild: guild,
      }
    })
  ]
}