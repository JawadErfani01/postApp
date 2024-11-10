import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./Layout/Layout.jsx";
import About from "./pages/About.jsx";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import "./index.css";
import PostPage from "./pages/PostPage.jsx";
import SinglePost from "./components/Post/SinglePost.jsx";
const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        {
          path: "/about",
          element: (
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          ),
        },
        {
          path: "/post",
          element: (
            <ProtectedRoute>
              <PostPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/post/:id",
          element: <SinglePost />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
