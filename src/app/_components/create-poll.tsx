"use client";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreatePoll() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [optionInput, setOptionInput] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);

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
        className="flex flex-col gap-2 rounded border border-gray-400 bg-white p-2 shadow-lg"
      >
        <div className="text-center">
          <h1 className="text-xl font-extrabold">create poll.</h1>
        </div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border border-gray-400 px-4 py-2 text-black shadow-lg"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Option"
            value={optionInput}
            onChange={(e) => setOptionInput(e.target.value)}
            className="w-full rounded border border-gray-400 px-4 py-2 text-black shadow-lg"
          />
          <button
            type="button"
            onClick={handleOptionAddition}
            className="rounded-full bg-green-400 px-6 py-2 font-semibold shadow-lg transition hover:scale-105 hover:bg-green-500"
          >
            <PlusIcon className="h-6 w-6 text-white" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((option, index) => (
            <button
              type="button"
              key={index}
              onClick={() => {
                setOptions(options.filter((o) => o !== option));
              }}
              className="cursor-pointer select-none rounded-full border border-gray-400 px-4 hover:bg-red-500"
            >
              {option}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setShowSettings(!showSettings);
          }}
        >
          <div className="flex place-items-center gap-2">
            <div className="flex">
              {showSettings ? (
                <ChevronDownIcon className="h-6 w-6 text-black" />
              ) : (
                <ChevronRightIcon className="h-6 w-6 text-black" />
              )}
              <p className="font-bold">Advanced</p>
            </div>
            <hr className="w-full rounded border border-black" />
          </div>
        </button>
        <div
          className={`flex place-items-center gap-2 ${showSettings ? "" : "hidden"}`}
        >
          <div className="flex place-items-center">
            <p>Time:</p>
            <select name="expires" id="expires">
              <option value="1">1d</option>
              <option value="7">7d</option>
            </select>
          </div>
          <div className="flex place-items-center gap-2">
            <p>Secure:</p>
            <input type="checkbox" />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-full border border-gray-400 bg-black/10 px-10 py-3 font-semibold shadow-lg transition hover:bg-black/20"
          disabled={createPoll.isLoading}
        >
          {createPoll.isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
}
