import express from "express";
import {
  register,
  login,
  getProfile,
  refreshToken,
  logout,
} from "../controllers/userController.js";
import authenticateToken from "../middleware/authenticateToken.js"; // Middleware to verify token
import { fileUpload } from "../middleware/fileUpload.js";

const router = express.Router();

// User registration route
router.post("/register", fileUpload.single("image"), register);

// User login route
router.post("/login", login);
// logout route
router.post("/logout", logout);
// refresh token
router.get("/refresh-token", refreshToken);
// Get user profile route
router.get("/profile", authenticateToken, getProfile); // Protect the profile route

export default router;
