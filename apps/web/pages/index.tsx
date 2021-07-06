import { NavBar } from "@notreddit/web/web-shared";
import { withUrqlClient } from "next-urql";

import { createUrqlClient } from "@notreddit/web/web-utils";

import { usePostsQuery } from "../generated/graphql";

export function Index() {
  const [{ data }] = usePostsQuery();
  return (
    <div>
      <NavBar />
      {!data ? <div className="loading btn btn-circle"></div> : data.posts.map((post) => <div key={post.id}>{post.content}</div>)}
    </div>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
