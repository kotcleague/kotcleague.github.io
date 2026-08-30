import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  parseLeaderboardData,
  type LeaderboardData,
} from "@/types/leaderboard";

interface LeaderboardState {
  data: LeaderboardData | null;
  error: string | null;
  loading: boolean;
}

const LeaderboardContext = createContext<LeaderboardState | null>(null);
let leaderboardRequest: Promise<LeaderboardData> | null = null;

function loadLeaderboard() {
  if (!leaderboardRequest) {
    leaderboardRequest = fetch(
      `${import.meta.env.BASE_URL}data/leaderboard.json?t=${Date.now()}`,
      { cache: "no-store" }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then(parseLeaderboardData)
      .catch((error) => {
        leaderboardRequest = null;
        throw error;
      });
  }

  return leaderboardRequest;
}

export function LeaderboardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void loadLeaderboard()
      .then((leaderboard) => {
        if (active) setData(leaderboard);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setError(
          error instanceof Error ? error.message : "Unknown leaderboard error"
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <LeaderboardContext.Provider value={{ data, loading, error }}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboard() {
  const state = useContext(LeaderboardContext);
  if (!state) {
    throw new Error("useLeaderboard must be used within LeaderboardProvider");
  }
  return state;
}
