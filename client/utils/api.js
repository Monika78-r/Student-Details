import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // change this to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
