import { shardManagerOptions } from '../../../config';
import { createShardManager } from './shard-manager';
import { Logger } from 'onu-logger';

const l = Logger.getSubLogger({name: "discord-bot"});

l.silly("test")

const shardManager = createShardManager(shardManagerOptions, l);

shardManager.spawnShards();