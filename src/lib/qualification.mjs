export const QUALIFICATION_MONTH = "2026-10";
export const CLUB_65_SOURCE = "https://www.rekplay.com/live/dtzk1o";

export function leagueCalendarDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  return ["year", "month", "day"]
    .map((type) => parts.find((part) => part.type === type).value)
    .join("-");
}

export function qualificationIsOpen(now = new Date()) {
  return leagueCalendarDate(now).slice(0, 7) === QUALIFICATION_MONTH;
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isCount(value) {
  return Number.isInteger(value) && value >= 0;
}

export function parseQualificationData(value) {
  if (
    !isRecord(value) ||
    value.month !== QUALIFICATION_MONTH ||
    !isRecord(value.clubs)
  ) {
    throw new Error("Invalid October qualification snapshot");
  }

  for (const id of ["paddle-up", "club-65"]) {
    const club = value.clubs[id];
    if (
      !isRecord(club) ||
      typeof club.source !== "string" ||
      !URL.canParse(club.source) ||
      !["https:", "http:"].includes(new URL(club.source).protocol) ||
      (id === "club-65" && club.source !== CLUB_65_SOURCE) ||
      typeof club.capturedAt !== "string" ||
      !Number.isFinite(Date.parse(club.capturedAt)) ||
      !qualificationIsOpen(new Date(club.capturedAt)) ||
      !Array.isArray(club.notes) ||
      !club.notes.every((note) => typeof note === "string" && note.trim()) ||
      !Array.isArray(club.rows) ||
      club.rows.length === 0
    ) {
      throw new Error(`Invalid ${id} qualification snapshot`);
    }

    const names = new Set();
    for (const row of club.rows) {
      if (
        !isRecord(row) ||
        typeof row.rank !== "string" ||
        !/^T?[1-9]\d*$/.test(row.rank) ||
        typeof row.name !== "string" ||
        !row.name.trim() ||
        names.has(row.name.trim().toLowerCase()) ||
        !isFiniteNumber(row.points) ||
        (id === "club-65" &&
          (typeof row.incompleteWeeks !== "boolean" ||
            !Array.isArray(row.weeklyPoints) ||
            row.weeklyPoints.length !== 4 ||
            !row.weeklyPoints.every(
              (points) => points === null || isFiniteNumber(points)
            ) ||
            !isCount(row.wins) ||
            !isCount(row.losses) ||
            !Number.isInteger(row.differential)))
      ) {
        throw new Error(`Invalid or duplicate ${id} standings row`);
      }
      names.add(row.name.trim().toLowerCase());
    }
  }

  return value;
}
