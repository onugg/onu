import { z } from "zod";
import { Message } from 'discord.js'
import { BasePart } from '../../types'

export const GuildMessageZ = BasePart.extend({
  data: z.object({
    id: z.string(),
    content: z.string()
  })
})

export type GuildMessageT = z.infer<typeof GuildMessageZ>

export const Loader = (message: Message): GuildMessageT => {
  // TODO: Clean message content

  return GuildMessageZ.parse({
    domain: 'discord',
    type: 'message',
    version: 1,
    data: {
      id: message.id,
      content: message.content
    }
  })
}