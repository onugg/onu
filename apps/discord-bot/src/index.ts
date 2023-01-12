import { shardManagerOptions } from '@/packages/config';
import { createShardManager } from './shard-manager';

const shardManager = createShardManager(shardManagerOptions);

shardManager.spawnShards();