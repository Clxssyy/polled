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
      <CreatePoll />
      <div>
        {polls.map((poll) => {
          return <Poll key={poll.id} poll={poll} />;
        })}
      </div>
    </>
  );
}
