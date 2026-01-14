import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true   // 🔥 THIS IS THE KEY
});

export default api;