import { z } from "zod";
import { Guild } from 'discord.js'
import { BasePart } from '../../types'

export const GuildZ = BasePart.extend({
  data: z.object({
    id: z.string()
  })
})

export type GuildT = z.infer<typeof GuildZ>

export const Loader = (guild: Guild): GuildT => {
  return GuildZ.parse({
    domain: 'discord',
    type: 'guild',
    version: 1,
    data: {
      id: guild.id
    }
  })
}