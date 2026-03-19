import axios from "axios";
import { BASE_URL } from "../utils/constants";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Add token to every request automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiConnector = (method, url, data, headers, params) => {
  return axiosInstance({
    method,
    url,
    data: data || null,
    headers: headers || null,
    params: params || null,
  });
};