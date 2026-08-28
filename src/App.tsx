import AppHeader from "@/components/AppHeader";
import LeagueDetails from "@/components/LeagueDetails";
import { documentTitleForRoute, ROUTES } from "@/config/site";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useHashRoute } from "@/hooks/useHashRoute";
import EventPage from "@/pages/EventPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import PlayerPage from "@/pages/PlayerPage";
import SchedulePage from "@/pages/SchedulePage";

export default function App() {
  const route = useHashRoute();
  useDocumentTitle(
    route.page === "event" || route.page === "player"
      ? null
      : documentTitleForRoute(route)
  );

  let content;
  switch (route.page) {
    case "schedule":
      content = <SchedulePage />;
      break;
    case "event":
      content = <EventPage eventId={route.eventId} />;
      break;
    case "player":
      content = <PlayerPage playerId={route.playerId} />;
      break;
    case "format":
      content = <LeagueDetails leaderboardUrl={ROUTES.rankings} />;
      break;
    default:
      content = <LeaderboardPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-ink transition-colors dark:bg-slate-950 dark:text-white">
      <AppHeader currentRoute={route} />
      {content}
    </div>
  );
}
