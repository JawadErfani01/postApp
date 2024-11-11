import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Optional: specify a folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"], // Restrict allowed formats
  },
});

const fileUpload = multer({ storage });
export { fileUpload };
