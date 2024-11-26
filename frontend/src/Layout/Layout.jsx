import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHome, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import axiosInstance from "../../utilities/axiosInstance";

const Layout = () => {
  const { setAccessToken, accessToken, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewAccessToken = async () => {
      try {
        const response = await axiosInstance.get("/user/refresh-token", {
          withCredentials: true,
        });
        setAccessToken(response.data.accessToken);
      } catch (err) {
        console.error("Could not refresh access token", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewAccessToken();
  }, [setAccessToken]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  if (loading) return <p className="text-center py-6">Loading...</p>;
  console.log(accessToken);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <nav className="bg-slate-800 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold flex items-center space-x-2">
            <Link to="/" className="hover:text-blue-400 flex items-center">
              Post App
            </Link>
          </h1>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link
                to="/"
                className="flex items-center text-white hover:text-blue-300 transition duration-200"
              >
                <FaHome className="mr-1" />
                Home
              </Link>
            </li>
            {!accessToken ? (
              <>
                <li>
                  <Link
                    to="/login"
                    className="flex items-center text-white hover:text-blue-300 transition duration-200"
                  >
                    <FaSignInAlt className="mr-1" />
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="flex items-center text-white hover:text-blue-300 transition duration-200"
                  >
                    <FaUserPlus className="mr-1" />
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/about"
                    className="text-white hover:text-blue-300 transition duration-200"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/post"
                    className="text-white hover:text-blue-300 transition duration-200"
                  >
                    MyPost
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-white hover:text-blue-300 transition duration-200"
                  >
                    <FaSignOutAlt className="mr-1" />
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <main className="container mx-auto flex-grow p-6">
        <Outlet />
      </main>

      <footer className="bg-slate-800 text-white p-6 text-center mt-auto">
        <p>&copy; 2024 Post App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
