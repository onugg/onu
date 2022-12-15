const { Client, GatewayIntentBits } = require('discord.js');
import { PrismaClient } from '@onu/prisma'
import { trpc } from '@onu/trpcclient'

var prisma = new PrismaClient();

async function start() {
  const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });
  discordClient.login('TOKEN');
}

start();