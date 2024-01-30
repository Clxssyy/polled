"use client";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreatePoll() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [optionInput, setOptionInput] = useState("");
  const [options, setOptions] = useState<string[]>([]);

  const createPoll = api.poll.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setTitle("");
      setOptions([]);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const handleOptionAddition = () => {
    if (optionInput.trim() !== "") {
      setOptions([...options, optionInput.trim()]);
      setOptionInput("");
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPoll.mutate({ title, options });
        }}
        className="flex flex-col gap-2 rounded p-2 shadow-lg border border-gray-400 bg-white"
      >
        <div className="text-center">
          <h1 className="text-xl font-extrabold">create poll.</h1>
        </div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded px-4 py-2 text-black border border-gray-400 shadow-lg"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Option"
            value={optionInput}
            onChange={(e) => setOptionInput(e.target.value)}
            className="w-full rounded px-4 py-2 text-black border border-gray-400 shadow-lg"
          />
          <button
            type="button"
            onClick={handleOptionAddition}
            className="rounded-full bg-green-400 px-6 py-2 font-semibold transition hover:scale-105 hover:bg-green-500 shadow-lg"
          >
            <PlusIcon className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {options.map((option, index) => (
            <button
              type="button"
              key={index}
              onClick={() => {
                setOptions(options.filter((o) => o !== option));
              }}
              className="rounded-full border border-gray-400 px-4 cursor-pointer select-none hover:bg-red-500"
            >
              {option}
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="rounded-full bg-black/10 px-10 py-3 font-semibold transition hover:bg-black/20 border border-gray-400 shadow-lg"
          disabled={createPoll.isLoading}
        >
          {createPoll.isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
}
