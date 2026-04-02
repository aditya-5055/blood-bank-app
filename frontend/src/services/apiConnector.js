
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { store } from "../store"; // import your redux store
import { logout } from "../slices/authSlice"; // adjust path if needed

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// ✅ Request interceptor — attach token
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

// ✅ Response interceptor — handle expired/invalid token
axiosInstance.interceptors.response.use(
  (response) => response, // if response is fine, just return it
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid — clear everything and redirect to login
      store.dispatch(logout());
      window.location.href = "/donor/login"; // adjust your login route if different
    }
    return Promise.reject(error);
  }
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