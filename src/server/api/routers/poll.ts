import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const pollRouter = createTRPCRouter({
  getMany: publicProcedure
    .input(
      z.object({
        count: z.number().optional(),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { count, userId } = input ?? {};
      let polls;

      if (count) {
        // Get a specific number of polls
        polls = await ctx.db.poll.findMany({
          take: count,
          include: {
            options: true,
            votes: true,
            createdBy: true,
          },
        });
      } else if (userId) {
        // Get polls created by a specific user
        polls = await ctx.db.poll.findMany({
          where: { createdById: userId },
          include: {
            options: true,
            votes: true,
            createdBy: true,
          },
        });
      } else {
        polls = await ctx.db.poll.findMany({
          include: {
            options: true,
            votes: true,
            createdBy: true,
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
          votes: true,
          createdBy: true,
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

      const poll = await ctx.db.poll.findFirst({
        where: { id },
        include: { createdBy: true },
      });

      if (!poll) {
        throw new Error("Poll not found");
      }

      if (!(ctx.session.user.id === poll?.createdBy.id)) {
        throw new Error("Not authorized");
      }

      // Delete votes associated with the poll
      await ctx.db.pollVote.deleteMany({
        where: { poll: { id } },
      });

      // Delete options associated with the poll
      await ctx.db.pollOption.deleteMany({
        where: { poll: { id } },
      });

      await ctx.db.poll.delete({
        where: { id },
      });

      return { success: true };
    }),

  vote: protectedProcedure
    .input(z.object({ pollId: z.number(), optionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { pollId, optionId } = input;

      // Check if the user has already voted
      const existingVote = await ctx.db.pollVote.findFirst({
        where: {
          poll: { id: pollId },
          user: { id: ctx.session.user.id },
        },
      });

      if (existingVote) {
        throw new Error("Already voted");
      }

      const poll = await ctx.db.poll.findFirst({
        where: { id: pollId },
        include: { options: true },
      });

      if (!poll) {
        throw new Error("Poll not found");
      }

      if (poll.createdById === ctx.session.user.id) {
        throw new Error("Cannot vote on your own poll");
      }

      const option = poll.options.find((o) => o.id === optionId);

      if (!option) {
        throw new Error("Option not found");
      }

      const vote = await ctx.db.pollVote.create({
        data: {
          pollOption: { connect: { id: optionId } },
          poll: { connect: { id: pollId } },
          user: { connect: { id: ctx.session.user.id } },
        },
      });

      return vote;
    }),

  getVotes: protectedProcedure
    .input(z.object({ pollId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { pollId } = input;

      const poll = await ctx.db.poll.findFirst({
        where: { id: pollId },
        include: { votes: true },
      });

      if (!poll) {
        throw new Error("Poll not found");
      }

      return poll.votes;
    }),
});
