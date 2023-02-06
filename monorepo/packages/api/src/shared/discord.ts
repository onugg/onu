import { eventEmitter, brokers } from "@onu/events"
import { prisma } from "@onu/database"
import { z } from "zod";

export const methods = (options: { emit: Function, prisma: typeof prisma }) => {
  var { emit, prisma } = options;

  async function createDiscordGuild(options: {
    name: string,
    discordId: string,
    communityId: string,
  }) {
    var { name, discordId, communityId } = options;

    const guild = await prisma.discordGuild.create({
      data: {
        name: name,
        discordId: discordId,
        communityId: communityId,
      },
    });

    var dbDiscordGuild: z.infer<typeof brokers.onuDatabase.discordGuildCreated_v1.dbDiscordGuild> = {
      id: guild.id,
      discordId: guild.discordId,
      name: name
    }

    var sourceName, type, event = brokers.onuDatabase.discordGuildCreated_v1.EventLoader(dbDiscordGuild)
    emit({sourcename: sourceName, type: type, event: event})

    return guild;
  }

  return { createDiscordGuild };
};

export default methods