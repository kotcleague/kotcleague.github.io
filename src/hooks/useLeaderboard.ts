import { useEffect, useState } from "react";
import {
  parseLeaderboardData,
  type LeaderboardData,
} from "@/types/leaderboard";

export function useLeaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLeaderboard() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/leaderboard.json?t=${Date.now()}`,
          { cache: "no-store", signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        setData(parseLeaderboardData(await response.json()));
      } catch (error) {
        if (controller.signal.aborted) return;
        setError(
          error instanceof Error ? error.message : "Unknown leaderboard error"
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadLeaderboard();
    return () => controller.abort();
  }, []);

  return { data, loading, error };
}
