import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import axiosInstance from "../../utilities/axiosInstance";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get("/post"); // Replace with your actual API endpoint
        setPosts(response.data);
      } catch (err) {
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Latest Posts
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-transform transform hover:scale-105 duration-300 ease-in-out"
          >
            {/* Post Image */}
            {post.postImage && (
              <img
                src={post.postImage}
                alt="Post Image"
                className="w-full h-52 object-cover"
              />
            )}

            {/* Post Content */}
            <div className="p-6">
              {/* User Details */}
              <div className="flex items-center mb-4">
                <img
                  src={post.user.profileImage}
                  alt="User Profile"
                  className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-indigo-200 hover:border-indigo-400 transition"
                />
                <div>
                  <h2 className="font-semibold text-gray-700 text-lg">
                    {post.user.name}
                  </h2>
                  <p className="text-sm text-gray-500">{post.user.email}</p>
                </div>
              </div>

              {/* Post Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {post.title}
              </h3>

              {/* Post Description */}
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                {post.description
                  ? post.description
                  : "No description available"}
              </p>

              {/* Additional Info */}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <Link
                  to={`/post/${post._id}`}
                  className="text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                >
                  Read More
                </Link>
                <span className="font-medium text-gray-400">3 min read</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
