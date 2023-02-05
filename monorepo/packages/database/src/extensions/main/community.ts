import { PrismaClient, Prisma } from '@prisma/client';
//import * as OnuKafkaTypes from "@onu/kafka/interfaces";

var prisma = new PrismaClient();

export async function deleteIfExists(emitEventCallBack: Function, communityDeleteArgs: Prisma.CommunityDeleteArgs) {
  var community = await prisma.community.findUnique({
    where: communityDeleteArgs.where
  })

  if (community) {
    await prisma.community.delete({
      where: communityDeleteArgs.where
    })

    /*var communityDeletedMessage: OnuKafkaTypes.Prisma.CommunityMessage = {
      communityId: community.id
    }

    emitEventCallBack(OnuKafkaTypes.Prisma.CommunityDeletedTopic, communityDeletedMessage)*/
  }
}

export async function createAndEmitEvent(emitEventCallBack: Function, communityCreateArgs: Prisma.CommunityCreateArgs) {

  var community = await prisma.community.create({
    data: communityCreateArgs.data
  })

  /*var communityCreatedMessage: OnuKafkaTypes.Prisma.CommunityMessage = {
    communityId: community.id
  }

  emitEventCallBack(OnuKafkaTypes.Prisma.CommunityCreatedTopic, communityCreatedMessage)*/

  return community
}