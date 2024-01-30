import { unstable_noStore as noStore } from "next/cache";

import { getServerAuthSession } from "~/server/auth";
import { CreatePoll } from "./_components/create-poll";
import { api } from "~/trpc/server";
import Poll from "./_components/poll";

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();
  const polls = await api.poll.getMany.query();

  return (
    <>
      <main className="flex flex-col place-items-center">
        <div className="w-1/2 p-2 flex flex-col gap-4">
          <CreatePoll />
          <div className="flex flex-col gap-2">
            {polls.map((poll) => {
              return <Poll key={poll.id} poll={poll} />;
            })}
          </div>
        </div>
      </main>
    </>
  );
}
