import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";
import { useAuthStore } from "@/stores/authStore";

import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

// Component to initialize auth
function App() {
  useEffect(() => {
    // Initialize auth from localStorage on app start
    useAuthStore.getState().initAuth();
  }, []);

  return <RouterProvider router={router} />;
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
