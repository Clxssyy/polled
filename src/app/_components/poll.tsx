import {
  BookmarkIcon,
  ChatBubbleBottomCenterIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import {
  Poll,
  type PollVote,
  type PollOption,
  type User,
} from "@prisma/client";
import EllipsisMenu from "./ellipsisMenu";
import Image from "next/image";
import Link from "next/link";
import VoteButton from "./voteButton";
import { getServerAuthSession } from "~/server/auth";

interface PollProps {
  poll: Poll & {
    options: PollOption[];
    votes: PollVote[];
    createdBy: User;
  };
}

const Poll = async (props: PollProps) => {
  const session = await getServerAuthSession();

  return (
    <>
      <div className="flex flex-col gap-2 rounded border border-gray-400 bg-white p-2 shadow-lg">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="flex place-items-center">
              <Link href={"/user/" + props.poll.createdBy.name}>
                <Image
                  width={30}
                  height={30}
                  src={props.poll.createdBy.image ?? "/default-avatar.png"}
                  alt={props.poll.createdBy.name ?? "User"}
                  className="rounded-full border border-black shadow-lg transition duration-200 hover:scale-105"
                />
              </Link>
            </div>
            <div className="flex place-items-center">
              <h1 className="text-xl font-extrabold">{props.poll.title}</h1>
            </div>
          </div>
          <div className="flex place-items-center">
            <EllipsisMenu pollId={props.poll.id} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {props.poll.options.map((pollOption: PollOption) => {
            return (
              <VoteButton
                key={pollOption.id}
                option={pollOption}
                session={session}
                poll={props.poll}
              />
            );
          })}
        </div>
        <div className="flex justify-between">
          <p className="text-xs">
            Votes: <span>{props.poll.votes.length}</span>
          </p>
          <p className="text-xs">Results</p>
        </div>
        <div className="flex justify-between">
          <div className="flex place-items-center gap-2">
            <button>
              <HeartIcon className="h-6 w-6 fill-transparent stroke-black stroke-[1.5] hover:fill-red-400 hover:stroke-red-400" />
            </button>
            <button>
              <BookmarkIcon className="h-6 w-6 fill-transparent stroke-black stroke-[1.5] hover:fill-yellow-400 hover:stroke-yellow-400" />
            </button>
            <button>
              <ChatBubbleBottomCenterIcon className="h-6 w-6 fill-transparent stroke-black stroke-[1.5] hover:stroke-2" />
            </button>
          </div>
          <p className="text-gray-300">#{props.poll.id}</p>
        </div>
      </div>
    </>
  );
};

export default Poll;
