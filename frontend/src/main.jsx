import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ImagePreviewProvider } from "./index.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ImagePreviewProvider>
      <App />
    </ImagePreviewProvider>
  </StrictMode>
);
