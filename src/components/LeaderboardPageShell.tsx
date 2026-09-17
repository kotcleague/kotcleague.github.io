import type { ReactNode } from "react";
import { ErrorState, LoadingState } from "@/components/DataStates";
import Footer from "@/components/Footer";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import type { LeaderboardData } from "@/types/leaderboard";

interface LeaderboardPageShellProps {
  children: (data: LeaderboardData) => ReactNode;
  errorTitle: string;
  header?: ReactNode | ((data: LeaderboardData) => ReactNode);
  loadingLabel: string;
}

export default function LeaderboardPageShell({
  children,
  errorTitle,
  header,
  loadingLabel,
}: LeaderboardPageShellProps) {
  const { data, error, loading } = useLeaderboard();

  return (
    <main>
      {typeof header === "function" ? data && header(data) : header}
      {loading && <LoadingState label={loadingLabel} />}
      {error && <ErrorState title={errorTitle} message={error} />}
      {data && (
        <>
          {children(data)}
          <Footer scrapedAt={data.scrapedAt} />
        </>
      )}
    </main>
  );
}
