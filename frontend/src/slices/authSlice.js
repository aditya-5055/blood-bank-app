import { createSlice } from "@reduxjs/toolkit";
import { TOKEN_KEY, USER_KEY } from "../utils/constants";

const initialState = {
  token: localStorage.getItem(TOKEN_KEY) || null,
  user: localStorage.getItem(USER_KEY)
    ? JSON.parse(localStorage.getItem(USER_KEY))
    : null,
  role: localStorage.getItem("role") || null,
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