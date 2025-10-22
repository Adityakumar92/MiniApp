import axios from "axios";

const api = axios.create({
  baseURL: 'https://miniapp-a5f3.onrender.com',
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
