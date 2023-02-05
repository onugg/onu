import { OnuKafka } from "@onu/kafka";
import { setupKafkaOptions } from "@onu/config";

var k = OnuKafka(setupKafkaOptions)

async function start() {
  k.configureTopics()
}

start()