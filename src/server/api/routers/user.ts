import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getMany: publicProcedure
    .input(
      z.object({
        count: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { count } = input ?? {};
      let users;

      if (count) {
        // Get a specific number of users
        users = await ctx.db.user.findMany({
          take: count,
        });
      } else {
        users = await ctx.db.user.findMany();
      }
      return users;
    }),

  getOne: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user.findFirst({
        where: { name: input.username },
      });
    }),
});
