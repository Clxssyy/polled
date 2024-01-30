import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

const Header = async () => {
  const session = await getServerAuthSession();

  return (
    <>
      <header className="flex border-black shadow-lg">
        <Link href="/" className="p-2 text-4xl font-bold">
          polled.
        </Link>
        <nav className="flex grow">
          <ul className="flex flex-grow items-center justify-center">
            <li className="p-2">
              <Link className="underline-offset-2 hover:underline" href="/hot">
                Hot
              </Link>
            </li>
            <li className="p-2">
              <Link className="underline-offset-2 hover:underline" href="/new">
                New
              </Link>
            </li>
            {session ? (
              <li className="p-2">
                <Link
                  className="underline-offset-2 hover:underline"
                  href="/following"
                >
                  Following
                </Link>
              </li>
            ) : null}
          </ul>
          <ul className="flex items-center justify-end">
            <li className="p-2">
              <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
                {session ? "Sign out" : "Login"}
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;
