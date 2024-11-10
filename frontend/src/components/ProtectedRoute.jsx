import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { accessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (accessToken !== undefined) {
      // Stop loading once we know if accessToken is defined or null
      setIsLoading(false);
    }
  }, [accessToken]);

  if (isLoading) return null; // Or a loading spinner if you prefer

  // Check if user is authenticated
  return accessToken ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
