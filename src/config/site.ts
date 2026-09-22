export const ROUTES = {
  rankings: "#/",
  schedule: "#/schedule",
  pastMonths: "#/schedule/month",
  format: "#/format",
  assignments: "#/assignments",
  deals: "#/deals",
} as const;

export type AppRoute =
  | { page: "rankings" }
  | { page: "schedule"; monthId?: string; pastMonths?: boolean }
  | { page: "event"; eventId: string }
  | { page: "event-assignments"; eventId: string }
  | { page: "player"; playerId: string }
  | { page: "format" }
  | { page: "assignments" }
  | { page: "deals" };

export const NAV_ITEMS = [
  {
    page: "rankings",
    route: ROUTES.rankings,
    label: "Rankings",
    title: "KOTC League | Leaderboard",
  },
  {
    page: "schedule",
    route: ROUTES.schedule,
    label: "Schedule",
    title: "KOTC League | Schedule",
  },
  {
    page: "format",
    route: ROUTES.format,
    label: "Format",
    title: "KOTC League | Format",
  },
] as const;

export type NavigationPage = (typeof NAV_ITEMS)[number]["page"];

export const SITE_LINKS = {
  standings:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vS3d2RVZh7OT4-wHFWvaTe0CnT3eSH-1rwGxLNyBURh8IZLThRAMXx5pd56XF6AURpWm1cDSsuhsQDj/pubhtml",
} as const;

export function eventRoute(eventId: string) {
  return `${ROUTES.schedule}/${encodeURIComponent(eventId)}`;
}

export function eventAssignmentsRoute(eventId: string) {
  return `${eventRoute(eventId)}/assignments`;
}

export function monthRoute(monthId: string) {
  return `${ROUTES.pastMonths}/${encodeURIComponent(monthId)}`;
}

export function playerRoute(playerId: string) {
  return `#/players/${encodeURIComponent(playerId)}`;
}

export function assignmentRoute(
  playerIds: string[],
  courtLabels: string[] = [],
  attendanceHidden = false
) {
  const query = new URLSearchParams();
  if (playerIds.length > 0) {
    query.set("players", playerIds.join(","));
  }
  if (courtLabels.length > 0) {
    query.set("courts", courtLabels.join(","));
  }
  if (attendanceHidden) {
    query.set("attendance", "hidden");
  }

  const queryString = query.toString();
  return `${ROUTES.assignments}${queryString ? `?${queryString}` : ""}`;
}

export function assignmentCourtLabelsFromHash(hash: string) {
  const queryStart = hash.indexOf("?");
  if (queryStart === -1) return [];

  return (
    new URLSearchParams(hash.slice(queryStart + 1))
      .get("courts")
      ?.split(",")
      .map((label) => label.trim())
      .filter((label) => /^[a-z0-9-]+$/i.test(label)) ?? []
  );
}

export function assignmentAttendanceHiddenFromHash(hash: string) {
  const queryStart = hash.indexOf("?");
  if (queryStart === -1) return false;

  return (
    new URLSearchParams(hash.slice(queryStart + 1)).get("attendance") ===
    "hidden"
  );
}

export function assignmentPlayerIdsFromHash(hash: string) {
  const queryStart = hash.indexOf("?");
  if (queryStart === -1) return [];

  return (
    new URLSearchParams(hash.slice(queryStart + 1))
      .get("players")
      ?.split(",")
      .filter((playerId) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(playerId)) ?? []
  );
}

export function navigationPageForRoute(route: AppRoute): NavigationPage | null {
  if (route.page === "player") return "rankings";
  if (route.page === "event" || route.page === "event-assignments") {
    return "schedule";
  }
  if (route.page === "assignments") return "rankings";
  if (route.page === "deals") return null;
  return route.page;
}

export function documentTitleForRoute(route: AppRoute) {
  if (route.page === "deals") {
    return "KOTC League | Pickleball Deals";
  }
  if (route.page === "assignments") {
    return "KOTC League | Court Assignments";
  }
  if (route.page === "event-assignments") {
    return "KOTC League | Event Assignments";
  }
  const page = navigationPageForRoute(route);
  return (
    NAV_ITEMS.find((item) => item.page === page)?.title ?? NAV_ITEMS[0].title
  );
}

export function parseHashRoute(hash: string): AppRoute {
  const path = hash.split("?")[0];

  if (path === "" || path === ROUTES.rankings) {
    return { page: "rankings" };
  }
  if (path === ROUTES.schedule || path === `${ROUTES.schedule}/`) {
    return { page: "schedule" };
  }
  const monthMatch = /^#\/schedule\/month\/(\d{4}-\d{2})\/?$/.exec(path);
  if (monthMatch) {
    return { page: "schedule", monthId: monthMatch[1] };
  }
  if (path === ROUTES.pastMonths) {
    return { page: "schedule", pastMonths: true };
  }
  if (path === ROUTES.format || path === `${ROUTES.format}/`) {
    return { page: "format" };
  }
  if (path === ROUTES.assignments || path === `${ROUTES.assignments}/`) {
    return { page: "assignments" };
  }
  if (path === ROUTES.deals || path === `${ROUTES.deals}/`) {
    return { page: "deals" };
  }
  const eventAssignmentsMatch =
    /^#\/schedule\/(\d{4}-\d{2}-\d{2})\/assignments\/?$/.exec(path);
  if (eventAssignmentsMatch) {
    return { page: "event-assignments", eventId: eventAssignmentsMatch[1] };
  }

  // Keep old bookmarks working while using #/format for all new links.
  if (path === "#/league" || path === "#/league/") {
    return { page: "format" };
  }

  const eventMatch = /^#\/schedule\/(\d{4}-\d{2}-\d{2})\/?$/.exec(path);
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
