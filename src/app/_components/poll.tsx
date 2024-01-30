import {
  BookmarkIcon,
  ChatBubbleBottomCenterIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import { Poll, PollOption } from "@prisma/client";
import EllipsisMenu from "./ellipsisMenu";

const Poll = (props: { poll: Poll }) => {
  return (
    <>
      <div className="p-4">
        <div className="flex flex-col gap-2 rounded border border-gray-400 bg-white p-2 shadow-lg">
          <div className="flex justify-between">
            <div>
              <h1 className="text-xl font-extrabold">{props.poll.title}</h1>
              <p className="text-xs">
                Votes: <span>{}</span>
              </p>
            </div>
            <div>
              <EllipsisMenu pollId={props.poll.id} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {props.poll.options.map((option: PollOption) => {
              return (
                <div
                  className="rounded border border-black hover:bg-gray-100"
                  key={option.id}
                >
                  <button className="h-full w-full rounded p-2">
                    {option.title}
                  </button>
                </div>
              );
            })}
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
      </div>
    </>
  );
};

export default Poll;
