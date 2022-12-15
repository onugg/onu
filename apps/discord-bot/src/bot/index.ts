const { Client, GatewayIntentBits } = require('discord.js');

import './polyfill';

async function start() {
  const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });
  discordClient.login('TOKEN');
}

start();