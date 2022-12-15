import { shardManagerOptions } from '../../../config';
import { createShardManager } from './shard-manager';

const shardManager = createShardManager(shardManagerOptions);

shardManager.spawnShards();