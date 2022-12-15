
import { ShardingManager } from 'discord.js';
import Path from 'path';

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
      token: 'TOKEN', 
      totalShards: "auto",
      execArgv: ['-r', 'ts-node/register']
    }
  );

  
  manager.on('shardCreate', (shard) => {

    shard.on("ready", () => {
      //l.info(`Shard ${shard.id} ready`)
    });

    //l.info(`Launched shard ${shard.id}`)
  });

  const spawnShards = async () => {
    manager.spawn();
  }

  return { spawnShards };
}

