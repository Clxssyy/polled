import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const pollRouter = createTRPCRouter({
  getMany: publicProcedure
    .input(z.object({ count: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      let polls;

      if (input) {
        // Get a specific number of polls
        polls = await ctx.db.poll.findMany({
          take: input.count,
          include: {
            options: true,
          },
        });
      } else {
        polls = await ctx.db.poll.findMany({
          include: {
            options: true,
          },
        });
      }
      return polls;
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.poll.findFirst({
        where: { id: input.id },
        include: {
          options: true,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        options: z.array(z.string()).min(2),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { title, options } = input;

      const poll = await ctx.db.poll.create({
        data: {
          title,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });

      const createdOptions = await Promise.all(
        options.map(async (optionName) => {
          return ctx.db.pollOption.create({
            data: {
              title: optionName,
              poll: { connect: { id: poll.id } },
            },
          });
        }),
      );

      return { poll, options: createdOptions };
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { id, title } = input;
      return ctx.db.poll.update({
        where: { id },
        data: { title },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      // Delete options associated with the poll
      await ctx.db.pollOption.deleteMany({
        where: { poll: { id } },
      });

      await ctx.db.poll.delete({
        where: { id },
      });

      return { success: true };
    }),
});
