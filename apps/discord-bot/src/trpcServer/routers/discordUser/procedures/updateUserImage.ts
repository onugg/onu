import { publicProcedure } from '@/index'
import { PrismaClient } from '@onu/prisma'
import { z } from 'zod'

var prisma = new PrismaClient();

export default 
  publicProcedure
    .input(
      z.object({
        userId: z.string(),
        image: z.string(),
      }),
    )
    .mutation(({ input }) => {
      return prisma.discordUser.update({
        where: {
          id: input.userId,
        },
        data: {
          image: input.image,
        },
      });
    })