import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import postRout from "./routes/postRouts.js";
import userRoute from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve images from the 'uploads' folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}
app.use("/uploads", express.static(uploadPath));

app.use(cookieParser());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://postapp01.vercel.app" // Deployed frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman) or matching allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies to be sent with requests
  })
);


// Handle CORS Errors
app.use((err, req, res, next) => {
  if (err instanceof Error && err.message === "Not allowed by CORS") {
    res.status(403).json({ message: "CORS error: Origin not allowed" });
  } else {
    next(err);
  }
});

// Root Route
app.get("/", (req, res) => {
  res.json("Hello");
});

// Database Connection
connectDB();

// Routes
app.use("/api/user", userRoute);
app.use("/api/post", postRout);

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is started on Port ${PORT}`);
});
