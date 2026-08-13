import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import "./index.css";
import App from "./App.tsx";

const address = import.meta.env.VITE_CONVEX_URL as string | undefined;
if (!address) {
  throw new Error(
    "VITE_CONVEX_URL is not set. Run `npx convex dev` to connect this " +
      "project to a Convex deployment (see README.md).",
  );
}

const convex = new ConvexReactClient(address);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <App />
      </BrowserRouter>
    </ConvexAuthProvider>
  </StrictMode>,
);
