import { Client } from 'discord.js'
import { Guild } from 'discord.js';
import { verifyGuildSetup } from './guild';

// runs on startup to sync the cache with the database
export async function ProcessCache (client: Client) {
  client.guilds.cache.map((guild: Guild) => {
    //addGuildOrUpdate(guild).then(() => {})

    verifyGuildSetup(guild).then(() => {})

  })
}