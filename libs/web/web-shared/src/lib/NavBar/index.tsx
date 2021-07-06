import Link from "next/link";

import { useMeQuery } from "../../../../../../apps/web/generated/graphql";

/* eslint-disable-next-line */
export interface NavBarProps { }

export function NavBar(props: NavBarProps) {
  const [{ data, fetching }] = useMeQuery()
  let body = null


  if (fetching) {
    body = null
  } else if (!data?.me) {
    body = (
      <div className="flex-none">
        <Link href="/login">
          <button className="mr-6 btn btn-ghost">
            Login
          </button>
        </Link>

        <Link href='/register'>
          <button className="btn btn-ghost">
            Register
          </button>
        </Link>
      </div>
    )
  } else {
    body = (
      <div className="flex-none">
        <h1 className="mr-6">{data.me.username}</h1>
        <button className="btn btn-ghost">
          Logout
        </button>
      </div>
    )
  }


  return (
    <div className="mb-2 shadow-lg navbar bg-neutral text-neutral-content">
      <div className="flex-1 px-2 mx-2">
        <span className="text-lg font-bold">
          NotReddit
        </span>
      </div>
      {body}
    </div>

  );
}

export default NavBar;
