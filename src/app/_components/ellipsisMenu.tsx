"use client";

import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

const EllipsisMenu = (props: { pollId: number }) => {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const deletePoll = api.poll.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <div className="relative">
      <button onClick={() => setShow(!show)}>
        <EllipsisVerticalIcon className="h-6 w-6 text-black" />
      </button>
      <div
        className={`font-bold ${show ? "absolute right-0 rounded bg-gray-200" : "hidden"}`}
      >
        <ul className="flex flex-col gap-2">
          <li>
            <button className="w-full rounded p-2">Edit</button>
          </li>
          <li>
            {/* Call handleDeletePoll when the Delete button is clicked */}
            <button
              className="w-full rounded p-2"
              onClick={() => {
                deletePoll.mutate({ id: props.pollId });
              }}
            >
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EllipsisMenu;
