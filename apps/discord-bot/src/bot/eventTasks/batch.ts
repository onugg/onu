const { Client } = require('discord.js');
import { Guild } from 'discord.js';
import { addGuildOrUpdate } from './guild';

// runs on startup to sync the cache with the database
export async function ProcessCache (client: typeof Client) {
  client.guilds.cache.map((guild: Guild) => {
    addGuildOrUpdate(guild).then(() => {})
  })
}