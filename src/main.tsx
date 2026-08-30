import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LeaderboardProvider } from "@/hooks/useLeaderboard";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LeaderboardProvider>
      <App />
    </LeaderboardProvider>
  </StrictMode>
);
