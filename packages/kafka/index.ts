import * as dotenv from 'dotenv';
import { Consumer, EachMessagePayload, ITopicConfig, Kafka, Producer } from 'kafkajs';
import { KafkaOptions, onuConsumer, AllTopics } from './interfaces';
dotenv.config();


export { Kafka } from 'kafkajs'


export function OnuKafka(options: KafkaOptions) {

  const brokers = JSON.parse(process.env["KAFKA_BROKERS"]!)

  const kafkaClient = new Kafka({
    clientId: options.clientId,
    brokers: brokers,
    
  })

  const producer: Producer = kafkaClient.producer({
    allowAutoTopicCreation: false,
    transactionTimeout: 30000
  })

  const configureTopics = async () => {
    console.log(`Configuring topics for ${options.clientId}`)

    const admin = kafkaClient.admin()
    var previouslyConfiguredTopics = await admin.listTopics()

    var missingTopics = AllTopics.filter((topic: string) => {
      return !previouslyConfiguredTopics.includes(topic)
    })

    if (missingTopics.length != 0) {
      console.log(`Configuring missing topics [${missingTopics.join("], [")}] for ${options.clientId}`)
  
      var missingTopicsObjArr: ITopicConfig[] = []
      missingTopics.forEach((topic: string) => {
        missingTopicsObjArr.push({
          topic: topic,
          numPartitions: 1
        })
      })
  
      await admin.createTopics({
        validateOnly: false,
        waitForLeaders: true,
        timeout: 50000,
        topics: missingTopicsObjArr,
      })
    } else {
      console.log(`No missing topics for ${options.clientId}`)
    }
  }

  const registerConsumers = async (consumers: onuConsumer[]) => {

    const consumer: Consumer = kafkaClient.consumer({ groupId: 'discord-bot' })
    await consumer.connect()

    var topics: string[] = []
    await consumers.forEach((consumer: onuConsumer) => {
      topics.push(consumer.topic)
    })

    await consumer.subscribe({ topics: topics })

    await consumer.run({
      eachMessage: async (messagePayLoad: EachMessagePayload) => {
        var consumerConfig = consumers.find((consumer: onuConsumer) => {
          return consumer.topic == messagePayLoad.topic
        })

        var callbackFunction = consumerConfig?.callback
        if (callbackFunction == undefined) {
          console.log(`No callback function found for topic ${messagePayLoad.topic}`)
          return
        }
        callbackFunction(messagePayLoad.topic, messagePayLoad.message.value?.toString())
      },
    })

    console.log(`Kafka consumers started for ${options.clientId}`)
  }
  const startProducer = async () => {
    await producer.connect()
    console.log(`Kafka producer started for ${options.clientId}`)
  }

  const emitEvent = (topicName: string, message: object) => {
    producer.send({
      topic: topicName,
      messages: [
        { key: 'message', value: JSON.stringify(message) }
      ]
    })
  }

  configureTopics()

  return { startProducer, registerConsumers, emitEvent }
}

