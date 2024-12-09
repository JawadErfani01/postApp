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
  if (!req.file) {
    return res.status(400).json({ message: "Please upload an image." });
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10");
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profileImage: req.file.path,
    });

    await newUser.save();

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: "postappapi.vercel.app",
    });

    res.status(200).json({ accessToken, profileImage: req.file.path });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Login User
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: "postappapi.vercel.app",
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Logout User
export const logout = (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      domain: "postappapi.vercel.app",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Refresh Access Token
export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log(req.cookies);

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, decoded) => {
      if (err) {
        console.error("JWT Error: ", err);
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      try {
        const user = await User.findById(decoded.userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
      } catch (error) {
        console.error("Error fetching user: ", error);
        return res
          .status(500)
          .json({ message: "Server error: " + error.message });
      }
    }
  );
};

// Get User Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
