import { api } from "~/trpc/server";
import Poll from "../_components/poll";

const Page = async ({ params }: { params: { pollId: string } }) => {
  const id = Number(params.pollId);

  if (isNaN(id)) {
    return null;
  }

  const poll = await api.poll.getOne.query({ id });

  console.log(poll);

  return <>{poll ? <Poll poll={poll} /> : null}</>;
};

export default Page;
