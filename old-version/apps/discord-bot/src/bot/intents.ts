import { GatewayIntentBits } from 'discord.js'

export const gatewayIntents = [
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.GuildMessageTyping,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildInvites,
  GatewayIntentBits.GuildMessageReactions
]