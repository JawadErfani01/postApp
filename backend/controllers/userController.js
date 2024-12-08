import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate tokens
const generateAccessToken = (user) =>
  jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
const generateRefreshToken = (user) =>
  jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION,
  });

// Register User
export const register = async (req, res) => {
  // Ensure image was uploaded
  if (!req.file) {
    return res.status(400).json({ message: "Please upload an image." });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash the password before saving
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10");
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with image path included
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profileImage: req.file.path, // Save the image path
    });

    await newUser.save();

    // Generate tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Set refresh token as a cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      domain: process.env.COOKIE_DOMAIN || "localhost",
    });

    res.status(200).json({ accessToken, profileImage: req.file.path });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Login a user
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // Ensure cookies are sent over HTTPS
      sameSite: "None", // Required for cross-domain cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: "vercel.app", // Set root domain for subdomain compatibility
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Logout a user
export const logout = (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Refresh Access Token
export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  // Verify the refresh token
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, decoded) => {
      if (err) {
        console.error("JWT Error: ", err); // Log the error for better debugging
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      try {
        const user = await User.findById(decoded.userId); // Fetch the user details again
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Generate a new access token
        const newAccessToken = generateAccessToken(user);
        return res.json({ accessToken: newAccessToken });
      } catch (error) {
        console.error("Error fetching user: ", error);
        return res
          .status(500)
          .json({ message: "Server error: " + error.message });
      }
    }
  );
};
// Get user profile by id
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
