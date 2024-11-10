import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import postRout from "./routes/postRouts.js";
import userRoute from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
// import multer from "multer";
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve images from the 'upload' folder

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173", // Development origin
  "https://postapp01.vercel.app", // Production origin
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
app.get("/", (req, res) => {
  res.json("Hello");
});
//db
connectDB();

//routes
app.use("/api/user", userRoute);
app.use("/api/post", postRout);

app.listen(PORT, () => {
  console.log(`Server is started on Port ${PORT}`);
});
