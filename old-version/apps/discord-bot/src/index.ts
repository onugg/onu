//import { shardManagerOptions } from '@onu/config';
//import { createShardManager } from './shard-manager';
import { startEventHttpServer } from './event-express-server'

//const shardManager = createShardManager(shardManagerOptions);

startEventHttpServer();

//shardManager.spawnShards();