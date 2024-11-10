import express from "express";
import {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
  getUserPost,
} from "../controllers/postController.js";
import { fileUpload } from "../middleware/fileUpload.js";
import authenticateToken from "../middleware/authenticateToken.js";

const route = express.Router();

// Get all posts
route.get("/", getPosts);

// Get posts of the authenticated user
route.get("/myPost", authenticateToken, getUserPost);

// get one post
route.get("/:id", getPost);

// Create a new post
route.post("/", authenticateToken, fileUpload.single("image"), createPost);

// Update a specific post by ID
route.put("/:id", authenticateToken, updatePost);

// Delete a specific post by ID
route.delete("/:id", authenticateToken, deletePost);

export default route;
