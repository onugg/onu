import { z } from "zod";
import { discord } from '../../common'
import { Base } from '../../types'
import { Shard } from 'discord.js'
import { SourceName } from '.'

export const Name = 'shard.ready'

export const MessageSchema = Base.extend({
  data: z.object({
    discordShard: discord.shardV1.ShardZ
  })
})

export const EventLoader = (discordShard: Shard): [string, string, z.infer<typeof MessageSchema>] => {
  var shard = discord.shardV1.Loader(discordShard)
  return [
    SourceName,
    Name, 
    MessageSchema.parse({
      version: 1,
      data: {
        discordShard: shard
      }
    })
  ]
}