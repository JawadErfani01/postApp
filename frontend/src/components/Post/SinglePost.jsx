import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Assuming react-router-dom is used

const SinglePost = () => {
  const { id } = useParams(); // Extract post ID from URL
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `https://postapp01.vercel.app/api/post/${id}`
        ); // Replace with actual API endpoint
        setPost(response.data);
      } catch (err) {
        setError("Failed to load the post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="text-indigo-600 font-semibold mb-8 hover:text-indigo-400 transition"
      >
        &larr; Back to Posts
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
        {/* Post Image */}
        {post.postImage && (
          <img
            src={`http://localhost:8000/${post.postImage.replace(/\\/g, "/")}`}
            alt="Post Image"
            className="w-full h-96 object-cover mb-6 rounded-lg"
          />
        )}

        {/* Post Content */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
        <div className="flex items-center mb-8">
          <img
            src={`http://localhost:8000/${post.user.profileImage.replace(
              /\\/g,
              "/"
            )}`}
            alt="User Profile"
            className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-gray-200"
          />
          <div>
            <h2 className="font-semibold text-lg text-gray-700">
              {post.user.name}
            </h2>
            <p className="text-sm text-gray-500">{post.user.email}</p>
          </div>
        </div>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {post.description ? post.description : "No description available."}
        </p>

        {/* Additional Info */}
        <div className="text-sm text-gray-500 mt-4">
          <p className="font-medium text-indigo-600">
            Estimated read time: 5 min
          </p>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
