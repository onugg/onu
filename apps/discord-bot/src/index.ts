import { shardManagerOptions } from '@onu/config';
import { createShardManager } from './shard-manager';

const shardManager = createShardManager(shardManagerOptions);

shardManager.spawnShards();