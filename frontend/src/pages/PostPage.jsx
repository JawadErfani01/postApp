import React from "react";
import PostList from "../components/Post/PostList";
import UserInfo from "../components/Post/UserInfo";

const PostPage = () => {
  return (
    <div className="mx-auto flex gap-5 flex-col">
      <UserInfo />
      <PostList />
    </div>
  );
};

export default PostPage;
