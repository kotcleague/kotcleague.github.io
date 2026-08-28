export const ROUTES = {
  rankings: "#/",
  schedule: "#/schedule",
  format: "#/format",
} as const;

export type AppRoute =
  | { page: "rankings" }
  | { page: "schedule" }
  | { page: "event"; eventId: string }
  | { page: "player"; playerId: string }
  | { page: "format" };

export const NAV_ITEMS = [
  {
    page: "rankings",
    route: ROUTES.rankings,
    label: "Rankings",
    title: "Paddle Up Pickleball | Leaderboard",
  },
  {
    page: "schedule",
    route: ROUTES.schedule,
    label: "Schedule",
    title: "KOTC Schedule | Paddle Up Pickleball",
  },
  {
    page: "format",
    route: ROUTES.format,
    label: "Format",
    title: "KOTC Format | Paddle Up Pickleball",
  },
] as const;

export type NavigationPage = (typeof NAV_ITEMS)[number]["page"];

export const SITE_LINKS = {
  club: "https://www.paddleuppickleballclub.com/",
  standings:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vS3d2RVZh7OT4-wHFWvaTe0CnT3eSH-1rwGxLNyBURh8IZLThRAMXx5pd56XF6AURpWm1cDSsuhsQDj/pubhtml",
} as const;

export function eventRoute(eventId: string) {
  return `${ROUTES.schedule}/${encodeURIComponent(eventId)}`;
}

export function playerRoute(playerId: string) {
  return `#/players/${encodeURIComponent(playerId)}`;
}

export function navigationPageForRoute(route: AppRoute): NavigationPage {
  if (route.page === "player") return "rankings";
  if (route.page === "event") return "schedule";
  return route.page;
}

export function documentTitleForRoute(route: AppRoute) {
  const page = navigationPageForRoute(route);
  return (
    NAV_ITEMS.find((item) => item.page === page)?.title ?? NAV_ITEMS[0].title
  );
}

export function parseHashRoute(hash: string): AppRoute {
  if (hash === "" || hash === ROUTES.rankings) {
    return { page: "rankings" };
  }
  if (hash === ROUTES.schedule || hash === `${ROUTES.schedule}/`) {
    return { page: "schedule" };
  }
  if (hash === ROUTES.format || hash === `${ROUTES.format}/`) {
    return { page: "format" };
  }

  // Keep old bookmarks working while using #/format for all new links.
  if (hash === "#/league" || hash === "#/league/") {
    return { page: "format" };
  }

  const eventMatch = /^#\/schedule\/(\d{4}-\d{2}-\d{2})\/?$/.exec(hash);
  if (eventMatch) {
    return { page: "event", eventId: eventMatch[1] };
  }

  const playerMatch = /^#\/players\/([^/]+)\/?$/.exec(hash);
  if (playerMatch) {
    try {
      const playerId = decodeURIComponent(playerMatch[1]);
      if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(playerId)) {
        return { page: "player", playerId };
      }
    } catch {
      return { page: "rankings" };
    }
  }

  return { page: "rankings" };
}
