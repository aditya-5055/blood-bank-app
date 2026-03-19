import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import store from "./store";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1a202c",
              color: "#fff",
            },
            success: {
              style: {
                background: "#1E8449",
              },
            },
            error: {
              style: {
                background: "#C0392B",
              },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);