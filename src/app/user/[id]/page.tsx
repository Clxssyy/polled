import { api } from "~/trpc/server";
import Poll from "../../_components/poll";

const Page = async ({ params }: { params: { id: String } }) => {
  const { id } = params;

  const user = await api.user.getOne.query({ username: id });

  console.log(user);

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
    return <div>User not found</div>;
  }
};

export default Page;
