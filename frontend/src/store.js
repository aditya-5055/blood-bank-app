
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";

const store = configureStore({
  reducer: rootReducer,
});

export { store };        // ✅ named export — for apiConnector.js
export default store;    // ✅ default export — for main.jsx