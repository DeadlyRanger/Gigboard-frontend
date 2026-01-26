import axios from "axios";

const api = axios.create({
  baseURL: "https://gigboard-backend-ox4r.onrender.com/api",
  withCredentials: true  
});

export default api;