import { string, z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const communityRouter = router({

    // Create Community
    createCommunity: protectedProcedure
    .input(z.object({
        name: z.string(),
        description: z.string(),
        imageUrl: string()
    }))
    .mutation(async ({ input, ctx }) => {
      const community = await ctx.prisma.community.create({
        data: {
            name: input.name,
            description: input.description,
            image: input.imageUrl
        },
      });
      return community;
    }),

  });