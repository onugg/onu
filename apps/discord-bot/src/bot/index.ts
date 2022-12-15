const { Client, GatewayIntentBits } = require('discord.js');
import { PrismaClient } from '@onu/prisma'

var prisma = new PrismaClient();
prisma.user.count()

import './polyfill';

async function start() {
  const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });
  discordClient.login('TOKEN');
}

start();