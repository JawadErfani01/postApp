import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaTrash, FaEdit } from "react-icons/fa";
import EditModal from "./EditModal";
import Modal from "react-modal";
import { usePost } from "../../context/PostContext";
import axios from "axios";

Modal.setAppElement("#root");

const PostList = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(true);

  const { accessToken } = useAuth();

  console.log(accessToken);

  useEffect(() => {
    if (!accessToken) return; // Prevent fetching if no accessToken is present

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/post/myPost",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );
        console.log(response);

        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "An error occurred. Please try again."
        );
        setLoading(false);
      }
    };

    fetchPosts();
  }, [accessToken]);

  const handleEdit = (post) => {
    setSelectedPost(post);
  };

  const handleUpdate = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
    setSelectedPost(null);
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`https://postapp01.vercel.app/api/post/${postId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      } catch (err) {
        setError("Failed to delete post. Please try again.");
      }
    }
  };

  console.log(posts);

  return (
    <div className="flex items-center justify-center bg-gray-100 py-8">
      <div className="w-full max-w-3xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-blue-700">Posts</h2>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {loading && <p className="text-center text-green-500">Loading...</p>}

        {posts.length > 0
          ? posts.map((post) => (
              <div
                key={post._id}
                className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden mb-6"
              >
                {post.postImage && (
                  <img
                    src={`http://localhost:8000/${post.postImage.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt="Post"
                    className="w-full h-56 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-blue-600">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-gray-700 text-lg">
                    {post.description}
                  </p>
                  <p className="mt-4 text-sm text-gray-500 italic">
                    Posted by:{" "}
                    <span className="text-blue-500 font-medium">
                      {post.user?.name || "Anonymous"}
                    </span>
                  </p>

                  <div className="mt-6 flex space-x-4">
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="flex items-center px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition duration-300"
                    >
                      <FaTrash className="mr-2" />
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(post)}
                      className="flex items-center px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition duration-300"
                    >
                      <FaEdit className="mr-2" />
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ))
          : !loading && (
              <p className="text-gray-700 text-center">No posts available.</p>
            )}

        {selectedPost && (
          <EditModal
            isOpen={!!selectedPost}
            onRequestClose={() => setSelectedPost(null)}
            post={selectedPost}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default PostList;
