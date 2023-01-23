import * as interfaces from './interfaces';
import { program } from 'commander'
import { writeFile } from "fs";

program
  .option('--out-file-path <outFilePath>', 'output file path')

program.parse()

const options = program.opts()

interface topic {
  name: string
}

async function start(outFilePath: string) {
  const topics: topic[] = []

  for (var topic of interfaces.AllTopics) {
    topics.push({name: topic})
  }

  // write to file
  await writeFile(outFilePath, JSON.stringify(topics), err => console.log(err))
}

start(options['outFilePath'])