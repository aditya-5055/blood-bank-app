 
import { createSlice } from "@reduxjs/toolkit";
import { TOKEN_KEY, USER_KEY } from "../utils/constants";

// ✅ Helper — decode JWT and check if expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
    const currentTime = Date.now() / 1000; // in seconds
    return payload.exp < currentTime; // true if expired
  } catch (e) {
    return true; // if decode fails, treat as expired
  }
};

// ✅ On app load — check if stored token is already expired
const storedToken = localStorage.getItem(TOKEN_KEY);
const validToken = isTokenExpired(storedToken) ? null : storedToken;

// If token was expired on load, clean up localStorage immediately
if (!validToken && storedToken) {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("role");
}

const initialState = {
  token: validToken,
  user: validToken
    ? localStorage.getItem(USER_KEY)
      ? JSON.parse(localStorage.getItem(USER_KEY))
      : null
    : null,
  role: validToken ? localStorage.getItem("role") || null : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem(TOKEN_KEY, action.payload);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
    },
    setRole: (state, action) => {
      state.role = action.payload;
      localStorage.setItem("role", action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem("role");
    },
  },
});

export const { setToken, setUser, setRole, logout } = authSlice.actions;
export default authSlice.reducer;