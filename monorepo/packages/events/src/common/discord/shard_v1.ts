import { z } from "zod";
import { Shard } from 'discord.js'
import { BasePart } from '../../types'

export const ShardZ = BasePart.extend({
  data: z.object({
    id: z.number()
  })
})

export type ShardT = z.infer<typeof ShardZ>

export const Loader = (shard: Shard): ShardT => {
  return ShardZ.parse({
    domain: 'discord',
    type: 'shard',
    version: 1,
    data: {
      id: shard.id
    }
  })
}