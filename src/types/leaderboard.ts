export const RANKING_VIEWS = [
  "current-month",
  "past-30-days",
  "all-time",
] as const;

export type RankingView = (typeof RANKING_VIEWS)[number];
export type MovementDir = "up" | "down" | "none";

export interface Movement {
  dir: MovementDir;
  places: number;
}

export interface PerformanceStats {
  gameMakerPoints: number;
  wins: number;
  losses: number;
  winRate: number;
  pointsEarned: number;
  pointsAgainst: number;
  pointDifferential: number;
}

export interface Player extends PerformanceStats {
  id: string;
  rank: number;
  name: string;
  points: number;
  events: number;
  move: Movement;
  photoUrl: string | null;
  gameMakerProfileUrl: string | null;
}

export interface PlayerReference {
  place: number;
  playerId: string;
  name: string;
}

export interface EventResult extends PerformanceStats {
  playerId: string;
  name: string;
  points: number;
  place: number;
  courts: number;
}

export interface PastEvent {
  id: string;
  date: string;
  playerCount: number;
  courts: number;
  games: number;
  maxPointsEarnable: number;
  rounds: number;
  podium: PlayerReference[];
  results: EventResult[];
}

export interface UpcomingEvent {
  id: string;
  date: string;
  courtReserveUrl: string | null;
  gameMakerUrl: string | null;
}

export interface LeaderboardData {
  scrapedAt: string;
  source: string;
  views: Record<RankingView, Player[]>;
  events: {
    upcoming: UpcomingEvent[];
    past: PastEvent[];
  };
}

type UnknownRecord = Record<string, unknown>;
const PLAYER_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PERFORMANCE_STAT_FIELDS = [
  "gameMakerPoints",
  "wins",
  "losses",
  "winRate",
  "pointsEarned",
  "pointsAgainst",
  "pointDifferential",
] as const satisfies readonly (keyof PerformanceStats)[];

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === "object";
}

function isPlayerId(value: unknown): value is string {
  return typeof value === "string" && PLAYER_ID_PATTERN.test(value);
}

function isDateId(value: unknown): value is string {
  if (typeof value !== "string") return false;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return (
    date.getUTCFullYear() === Number(year) &&
    date.getUTCMonth() === Number(month) - 1 &&
    date.getUTCDate() === Number(day)
  );
}

function isMovement(value: unknown): value is Movement {
  if (!isRecord(value)) return false;

  return (
    (value.dir === "up" || value.dir === "down" || value.dir === "none") &&
    typeof value.places === "number"
  );
}

function hasNumericFields<const Field extends string>(
  value: UnknownRecord,
  fields: readonly Field[]
): value is UnknownRecord & Record<Field, number> {
  return fields.every((field) => typeof value[field] === "number");
}

function isPerformanceStats(
  value: UnknownRecord
): value is UnknownRecord & PerformanceStats {
  return hasNumericFields(value, PERFORMANCE_STAT_FIELDS);
}

function isPlayer(value: unknown): value is Player {
  if (!isRecord(value)) return false;

  return (
    isPlayerId(value.id) &&
    typeof value.rank === "number" &&
    typeof value.name === "string" &&
    typeof value.points === "number" &&
    typeof value.events === "number" &&
    isPerformanceStats(value) &&
    isMovement(value.move) &&
    isOptionalUrl(value.photoUrl) &&
    isOptionalUrl(value.gameMakerProfileUrl)
  );
}

function isPlayerReference(value: unknown): value is PlayerReference {
  return (
    isRecord(value) &&
    typeof value.place === "number" &&
    isPlayerId(value.playerId) &&
    typeof value.name === "string"
  );
}

function isEventResult(value: unknown): value is EventResult {
  return (
    isRecord(value) &&
    isPlayerId(value.playerId) &&
    typeof value.name === "string" &&
    typeof value.points === "number" &&
    typeof value.place === "number" &&
    typeof value.courts === "number" &&
    isPerformanceStats(value)
  );
}

function isPastEvent(value: unknown): value is PastEvent {
  return (
    isRecord(value) &&
    isDateId(value.id) &&
    value.date === value.id &&
    typeof value.playerCount === "number" &&
    typeof value.courts === "number" &&
    typeof value.games === "number" &&
    typeof value.maxPointsEarnable === "number" &&
    typeof value.rounds === "number" &&
    Array.isArray(value.podium) &&
    value.podium.every(isPlayerReference) &&
    Array.isArray(value.results) &&
    value.results.every(isEventResult)
  );
}

function isOptionalUrl(value: unknown): value is string | null {
  if (value === null) return true;
  if (typeof value !== "string") return false;
  if (value.startsWith("images/")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isUpcomingEvent(value: unknown): value is UpcomingEvent {
  return (
    isRecord(value) &&
    isDateId(value.id) &&
    value.date === value.id &&
    isOptionalUrl(value.courtReserveUrl) &&
    isOptionalUrl(value.gameMakerUrl)
  );
}

function isArrayOf<T>(
  value: unknown,
  guard: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(guard);
}

export function parseLeaderboardData(value: unknown): LeaderboardData {
  if (!isRecord(value)) {
    throw new Error("Leaderboard data is not an object");
  }

  const views = value.views;
  const events = value.events;

  if (
    typeof value.scrapedAt !== "string" ||
    typeof value.source !== "string" ||
    !isRecord(views) ||
    !isArrayOf(views["current-month"], isPlayer) ||
    !isArrayOf(views["past-30-days"], isPlayer) ||
    !isArrayOf(views["all-time"], isPlayer) ||
    !isRecord(events) ||
    !isArrayOf(events.upcoming, isUpcomingEvent) ||
    !isArrayOf(events.past, isPastEvent)
  ) {
    throw new Error("Leaderboard data has an invalid format");
  }

  return {
    scrapedAt: value.scrapedAt,
    source: value.source,
    views: {
      "current-month": views["current-month"],
      "past-30-days": views["past-30-days"],
      "all-time": views["all-time"],
    },
    events: {
      upcoming: events.upcoming,
      past: events.past,
    },
  };
}
