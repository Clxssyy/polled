"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreatePoll() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [optionInput, setOptionInput] = useState(""); // State to handle option input
  const [options, setOptions] = useState<string[]>([]); // State to store all options

  const createPoll = api.poll.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setTitle("");
      setOptions([]); // Clear options after successful creation
    },
  });

  const handleOptionAddition = () => {
    if (optionInput.trim() !== "") {
      setOptions([...options, optionInput.trim()]); // Add new option to the list
      setOptionInput(""); // Clear the input field after adding option
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPoll.mutate({ title, options });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Option"
          value={optionInput}
          onChange={(e) => setOptionInput(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="button"
          onClick={handleOptionAddition}
          className="rounded-full bg-white/10 px-6 py-2 font-semibold transition hover:bg-white/20"
        >
          Add Option
        </button>
      </div>
      <div>
        {/* Render added options */}
        {options.map((option, index) => (
          <div key={index}>{option}</div>
        ))}
      </div>
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createPoll.isLoading}
      >
        {createPoll.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
