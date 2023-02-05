import { z } from "zod";
import { Base, dbUpdate } from '../../types'

export const Name = 'discord.guild.updated'

export const dbDiscordGuildUpdate = dbUpdate.extend({
  discordId: z.string({})
})

export const MessageSchema = Base.extend({
  data: z.object({
    dbDiscordGuildUpdate: dbUpdate.extend({
      discordId: z.string({})
    })
  })
})

export const EventLoader = (discordGuildUpdate: z.infer<typeof dbDiscordGuildUpdate>): [string, z.infer<typeof MessageSchema>] => {
  return [
    Name,
    MessageSchema.parse({
      version: 1,
      data: {
        dbDiscordGuildUpdate: discordGuildUpdate,
      }
    })
  ]
}