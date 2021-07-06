import { NavBar } from "@notreddit/web/web-shared";
import { withUrqlClient } from "next-urql";

import { createUrqlClient } from "@notreddit/web/web-utils";

import { usePostsQuery } from "../generated/graphql";

export function Index() {
  const [{ data }] = usePostsQuery();
  return (
    <div>
      <NavBar />
    </div>
  );
}

export default withUrqlClient(createUrqlClient)(Index);
