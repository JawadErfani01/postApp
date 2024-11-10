import React, { useEffect, useState } from "react";
import { usePost } from "../../context/PostContext";
import CreatePost from "./CreatePost";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const UserInfo = () => {
  const { user, setUser } = usePost();
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          "https://postappapi.vercel.app/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [accessToken, setUser]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl space-y-10">
      {/* User Profile Section */}
      <div className="flex items-center space-x-8 p-8 bg-blue-50 rounded-lg shadow-lg transition-shadow duration-300 ease-in-out">
        <div className="flex-shrink-0 flex items-center justify-center">
          {user.profileImage ? (
            <img
              src={`http://localhost:8000/${user.profileImage.replace(
                /\\/g,
                "/"
              )}`}
              alt="User profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-md"
            />
          ) : (
            <FaUserCircle className="w-32 h-32 text-blue-400" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-4xl font-bold text-blue-700">{user.name}</h2>
          <p className="text-gray-600 text-lg">{user.email}</p>
        </div>
      </div>

      {/* Section Header and Create Post Button */}
      <div className="flex items-center justify-between pt-8 border-t border-gray-300">
        <h3 className="text-2xl font-semibold text-gray-800">Add a New Post</h3>
        <CreatePost />
      </div>
    </div>
  );
};

export default UserInfo;
