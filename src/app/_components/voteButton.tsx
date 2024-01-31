"use client";

import { Poll, PollOption, PollVote } from "@prisma/client";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

const VoteButton = (props: {
  session: Session | null;
  option: PollOption;
  poll: Poll;
}) => {
  const router = useRouter();
  const votePoll = api.poll.vote.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      console.error(error);
      router.refresh();
    },
  });

  const optionVotes = props.poll.votes.filter((vote: PollVote) => {
    return vote.pollOptionId === props.option.id;
  }).length;

  const userVoted = props.poll.votes.find((vote: PollVote) => {
    return vote.userId === props.session?.user.id;
  });

  if (userVoted) {
    const votedOption = userVoted.pollOptionId === props.option.id;

    return (
      <>
        <div
          className="select-none rounded border border-black bg-black/20"
          key={props.option.id}
        >
          <div
            className={`h-full w-[${(optionVotes / props.poll.votes.length) * 100}%] rounded ${votedOption ? "bg-green-300" : "bg-black/30"} p-2`}
          >
            {props.option.title}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div
          className="rounded border border-black hover:bg-gray-100"
          key={props.option.id}
        >
          <button
            className="h-full w-full rounded p-2"
            onClick={() => {
              votePoll.mutate({
                pollId: props.option.pollId,
                optionId: props.option.id,
              });
            }}
          >
            {props.option.title}
          </button>
        </div>
      </>
    );
  }
};

export default VoteButton;
