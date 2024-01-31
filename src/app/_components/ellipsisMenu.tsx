"use client";

import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

const EllipsisMenu = (props: { pollId: number }) => {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const deletePoll = api.poll.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      setShow(!show);
    },
    onError: (error) => {
      router.refresh();
      setShow(!show);
    },
  });

  return (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className="flex place-items-center"
      >
        <EllipsisVerticalIcon className="h-6 w-6 text-black" />
      </button>
      <div
        className={`absolute -left-6 -top-1 rounded border border-black bg-gray-200 font-bold transition duration-200 ${show ? "-translate-x-12" : "scale-0 opacity-0"}`}
      >
        <ul className="flex divide-x divide-black">
          <li>
            <button
              className="p-2"
              onClick={() => {
                deletePoll.mutate({ id: props.pollId });
              }}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </li>
          <li>
            <button className="p-2">
              <PencilIcon className="h-4 w-4" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EllipsisMenu;
