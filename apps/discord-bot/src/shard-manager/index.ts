
import { ShardingManager } from 'discord.js';
import * as dotenv from 'dotenv';
import Path from 'path';

dotenv.config();

export interface ShardManagerOptions {
  dev?: boolean;
  port?: number;
  prefix?: string;
}

export function createShardManager(shardManagerOptions: ShardManagerOptions) {

  console.log(shardManagerOptions)

  const manager = new ShardingManager(
    Path.join(__dirname, '../bot/index.ts'), 
    { 
      token: process.env["DISCORD_TOKEN"], 
      totalShards: "auto",
      execArgv: ['-r', 'ts-node/register']
    }
  );

  
  manager.on('shardCreate', (shard) => {

    shard.on("ready", () => {
      console.log(`Shard ${shard.id} ready`)
    });

    console.log(`Launched shard ${shard.id}`)
  });

  const spawnShards = async () => {
    manager.spawn();
  }

  return { spawnShards };
}

