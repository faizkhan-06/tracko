import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthProvider.jsx";
import { TransectionProvider } from "./contexts/TransectionProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <TransectionProvider>
        <App />
      </TransectionProvider>
    </AuthProvider>
  </StrictMode>
);
