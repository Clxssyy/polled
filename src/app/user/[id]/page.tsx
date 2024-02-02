import { api } from "~/trpc/server";
import Poll from "../../_components/poll";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const user = await api.user.getOne.query({ username: id });

  if (user) {
    const polls = await api.poll.getMany.query({ userId: user.id });

    return (
      <main className="flex flex-col place-items-center">
        <div className="flex w-1/2 flex-col gap-4 p-2">
          <div className="flex flex-col gap-2">
            {polls.map((poll) => {
              return <Poll key={poll.id} poll={poll} />;
            })}
          </div>
        </div>
      </main>
    );
  } else {
    return (
      <main className="flex h-full w-full place-items-center">
        <div className="align-center flex w-full place-items-center justify-center gap-2">
          <FaceFrownIcon className="h-8 w-8" />
          <p className="font-bold">user doesn't exist.</p>
        </div>
      </main>
    );
  }
};

export default Page;
