// src/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://postappapi.vercel.app/api",
  // baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export default axiosInstance;
