import { api } from "~/trpc/server";
import Poll from "../../_components/poll";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const user = await api.user.getOne.query({ username: id });

  if (user) {
    const polls = await api.poll.getMany.query({ userId: user.id });

    return (
      <>
        {polls.map((poll) => {
          return <Poll key={poll.id} poll={poll} />;
        })}
      </>
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
