import { z } from "zod";
import * as common from '../../common'
import { Base } from '../../types'
import { Message } from 'discord.js'
import { SourceName } from '.'

export const Name = 'guildMessage.sent'

export const MessageSchema = Base.extend({
  data: z.object({
    discordGuild: common.discord.guildV1.GuildZ,
    messageSent: common.discord.guildMessageV1.GuildMessageZ
  })
})

export const EventLoader = (discordMessage: Message): [string, string, z.infer<typeof MessageSchema>] => {
  if (!discordMessage.guild) {throw new Error('Message sent in DM')}

  var guild = common.discord.guildV1.Loader(discordMessage.guild)
  var message = common.discord.guildMessageV1.Loader(discordMessage)
  return [
    SourceName,
    Name, 
    MessageSchema.parse({
      version: 1,
      data: {
        discordGuild: guild,
        messageSent: message
      }
    })
  ]
}