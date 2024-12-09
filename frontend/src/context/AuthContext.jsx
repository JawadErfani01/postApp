// src/context/AuthContext.jsx
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../../utilities/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // const login = (token) => {
  //   setIsAuthenticated(true)
  //   setAccessToken(token)
  // };
  // const logout = () => setIsAuthenticated(false);

  const logoutUser = async () => {
    try {
      await axiosInstance.post("/user/logout", {});
      setAccessToken(null);
      // Clear any access token or user data stored in state or context
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ logoutUser, accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
