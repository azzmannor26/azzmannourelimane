import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./router/AppRoutes"; // Routes for the app
import "./index.css"; // Import global styles
import { LanguageProvider } from "./store/LanguageStore"; // Language context
import { MultiStepProvider } from "./store/StepStore.jsx";
import { UserProvider } from "./store/UserContext"; // Import the provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserProvider>
  <React.StrictMode>
    <LanguageProvider>
        <MultiStepProvider>
      <AppRoutes />
        </MultiStepProvider>
    </LanguageProvider>
  </React.StrictMode>
  </UserProvider>
);
