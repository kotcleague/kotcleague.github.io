import { load } from "cheerio";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(
  __dirname,
  "..",
  "public",
  "data",
  "leaderboard.json"
);

// Published "King of the Court League" Google Sheet.
const PUBLISH_ID =
  "2PACX-1vS3d2RVZh7OT4-wHFWvaTe0CnT3eSH-1rwGxLNyBURh8IZLThRAMXx5pd56XF6AURpWm1cDSsuhsQDj";
const BASE = `https://docs.google.com/spreadsheets/d/e/${PUBLISH_ID}/pubhtml`;

// Ranking sheet tab name -> site view slug.
const VIEWS = {
  "Current Month": "current-month",
  "Past 30 Days": "past-30-days",
  "All Time": "all-time",
};

const EVENT_TABS = ["Past Events", "Upcoming Events", "Event Log"];
const SHEET_DATE_PATTERN = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
const PERFORMANCE_FIELDS = [
  ["gameMakerPoints", "Game Maker points"],
  ["wins", "wins"],
  ["losses", "losses"],
  ["winRate", "win rate"],
  ["pointsEarned", "points earned"],
  ["pointsAgainst", "points against"],
  ["pointDifferential", "point differential"],
];

async function fetchHtml(url) {
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

// Read the published tab menu and map each tab name to its gid.
// Google builds the tab menu with JavaScript, so the mapping lives in a series
// of `items.push({name: "...", ..., gid: "..."})` calls rather than in the DOM.
function parseTabGids(html) {
  const gids = {};
  const re = /items\.push\(\{name:\s*"((?:[^"\\]|\\.)*)"[^}]*?gid:\s*"(\d+)"/g;
  let match;
  while ((match = re.exec(html)) !== null) {
    const name = JSON.parse(`"${match[1]}"`);
    gids[name] = match[2];
  }
  return gids;
}

// Turn a movement cell's text into a structured value.
// "●" / "" => none, "▲5" => up 5, "▼1" => down 1.
function parseMovement(text) {
  const trimmed = (text || "").trim();
  if (trimmed.startsWith("▲")) {
    return { dir: "up", places: parseInt(trimmed.slice(1), 10) || 0 };
  }
  if (trimmed.startsWith("▼")) {
    return { dir: "down", places: parseInt(trimmed.slice(1), 10) || 0 };
  }
  return { dir: "none", places: 0 };
}

function parseRequiredNumber(text, field, context) {
  const value = Number(text);
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid ${field} "${text}" in ${context}`);
  }
  return value;
}

function parsePerformanceStats(cells, context) {
  return Object.fromEntries(
    PERFORMANCE_FIELDS.map(([key, label], index) => [
      key,
      parseRequiredNumber(cells[index], label, context),
    ])
  );
}

function readRowCells($, row) {
  return $(row)
    .find("td")
    .map((_, td) => $(td).text().trim())
    .get();
}

function isDatedRow(cells, minimumCells) {
  return cells.length >= minimumCells && SHEET_DATE_PATTERN.test(cells[0]);
}

function parseDateId(text, context) {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/.exec(text.trim());
  if (!match) {
    throw new Error(`Invalid date "${text}" in ${context}`);
  }

  const month = Number(match[1]);
  const day = Number(match[2]);
  const yearValue = Number(match[3]);
  const year = yearValue < 100 ? 2000 + yearValue : yearValue;
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`Invalid calendar date "${text}" in ${context}`);
  }

  return `${year.toString().padStart(4, "0")}-${month
    .toString()
    .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

function parseOptionalUrl(text, field, context) {
  const value = text.trim();
  if (!value) return null;

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid ${field} URL "${value}" in ${context}`);
  }

  if (
    (url.hostname === "google.com" || url.hostname === "www.google.com") &&
    url.pathname === "/url"
  ) {
    const target = url.searchParams.get("q");
    if (target) {
      try {
        url = new URL(target);
      } catch {
        throw new Error(
          `Invalid ${field} redirect URL "${target}" in ${context}`
        );
      }
    }
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`Unsupported ${field} URL protocol in ${context}`);
  }

  return url.toString();
}

function createPlayerRegistry() {
  const idsByName = new Map();
  const namesById = new Map();

  return {
    get(name) {
      const normalizedName = name.trim().replace(/\s+/g, " ");
      if (!normalizedName) {
        throw new Error("Cannot create a player ID from an empty name");
      }

      const nameKey = normalizedName.toLocaleLowerCase("en-US");
      const existing = idsByName.get(nameKey);
      if (existing) return existing;

      const id = normalizedName
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("en-US")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      if (!id) {
        throw new Error(`Cannot create a player ID from "${normalizedName}"`);
      }

      const conflictingName = namesById.get(id);
      if (conflictingName && conflictingName !== nameKey) {
        throw new Error(
          `Player ID collision: "${normalizedName}" and "${conflictingName}" both map to "${id}"`
        );
      }

      idsByName.set(nameKey, id);
      namesById.set(id, nameKey);
      return id;
    },
  };
}

// Parse a single ranking tab's HTML table into player rows.
function parseRankingTable(html, tabName, players) {
  const $ = load(html);
  const rankings = [];

  $("table tbody tr").each((_, row) => {
    const cells = readRowCells($, row);

    if (cells.length < 12) return;

    const [
      rankText,
      moveText,
      name,
      pointsText,
      eventsText,
      ...performanceCells
    ] = cells;

    // Skip the header row and any empty/padding rows.
    if (!name || !/^\d+$/.test(rankText)) return;

    const context = `"${tabName}" row for ${name}`;
    rankings.push({
      id: players.get(name),
      rank: parseRequiredNumber(rankText, "rank", context),
      name,
      points: parseRequiredNumber(pointsText, "points", context),
      events: parseRequiredNumber(eventsText, "event count", context),
      ...parsePerformanceStats(performanceCells, context),
      move: parseMovement(moveText),
    });
  });

  return rankings;
}

function parsePastEvents(html, players) {
  const $ = load(html);
  const events = [];

  $("table tbody tr").each((_, row) => {
    const cells = readRowCells($, row);

    if (!isDatedRow(cells, 9)) return;

    const [
      dateText,
      playerCountText,
      courtsText,
      gamesText,
      maxPointsText,
      roundsText,
      first,
      second,
      third,
    ] = cells;
    const id = parseDateId(dateText, '"Past Events"');
    const context = `"Past Events" row for ${id}`;
    const podium = [first, second, third].map((name, index) => ({
      place: index + 1,
      playerId: players.get(name),
      name,
    }));

    events.push({
      id,
      date: id,
      playerCount: parseRequiredNumber(
        playerCountText,
        "player count",
        context
      ),
      courts: parseRequiredNumber(courtsText, "courts", context),
      games: parseRequiredNumber(gamesText, "games", context),
      maxPointsEarnable: parseRequiredNumber(
        maxPointsText,
        "maximum points earnable",
        context
      ),
      rounds: parseRequiredNumber(roundsText, "rounds", context),
      podium,
      results: [],
    });
  });

  return events;
}

function parseUpcomingEvents(html) {
  const $ = load(html);
  const events = [];

  $("table tbody tr").each((_, row) => {
    const cells = readRowCells($, row);

    if (!isDatedRow(cells, 3)) return;

    const [dateText, courtReserveText, gameMakerText] = cells;
    const tableCells = $(row).find("td");
    const courtReserveUrl =
      tableCells.eq(1).find("a").attr("href") ?? courtReserveText;
    const gameMakerUrl =
      tableCells.eq(2).find("a").attr("href") ?? gameMakerText;
    const id = parseDateId(dateText, '"Upcoming Events"');
    const context = `"Upcoming Events" row for ${id}`;

    events.push({
      id,
      date: id,
      courtReserveUrl: parseOptionalUrl(
        courtReserveUrl,
        "Court Reserve",
        context
      ),
      gameMakerUrl: parseOptionalUrl(gameMakerUrl, "Game Maker", context),
    });
  });

  return events;
}

function parseEventLog(html, players) {
  const $ = load(html);
  const resultsByEvent = new Map();

  $("table tbody tr").each((_, row) => {
    const cells = readRowCells($, row);

    if (!isDatedRow(cells, 12)) return;

    const [
      dateText,
      name,
      pointsText,
      placeText,
      courtsText,
      ...performanceCells
    ] = cells;
    const eventId = parseDateId(dateText, '"Event Log"');
    const context = `"Event Log" row for ${name} on ${eventId}`;
    const result = {
      playerId: players.get(name),
      name,
      points: parseRequiredNumber(pointsText, "points", context),
      place: parseRequiredNumber(placeText, "place", context),
      courts: parseRequiredNumber(courtsText, "courts", context),
      ...parsePerformanceStats(performanceCells, context),
    };

    const eventResults = resultsByEvent.get(eventId) ?? [];
    eventResults.push(result);
    resultsByEvent.set(eventId, eventResults);
  });

  return resultsByEvent;
}

function assertUniqueIds(items, context) {
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.id)) {
      throw new Error(`Duplicate ${context} ID: ${item.id}`);
    }
    seen.add(item.id);
  }
}

async function scrape() {
  console.log("Discovering sheet tabs...");
  const menuHtml = await fetchHtml(BASE);
  const gids = parseTabGids(menuHtml);
  const requiredTabs = [...Object.keys(VIEWS), ...EVENT_TABS];
  const missingTabs = requiredTabs.filter((tabName) => !gids[tabName]);

  if (missingTabs.length > 0) {
    throw new Error(
      `Missing published tabs: ${missingTabs.join(", ")}. Available tabs: ${
        Object.keys(gids).join(", ") || "(none)"
      }`
    );
  }

  const htmlByTab = Object.fromEntries(
    await Promise.all(
      requiredTabs.map(async (tabName) => {
        console.log(`Fetching "${tabName}" (gid=${gids[tabName]})...`);
        return [tabName, await fetchHtml(`${BASE}/sheet?gid=${gids[tabName]}`)];
      })
    )
  );

  const playerRegistry = createPlayerRegistry();
  const views = {};
  for (const [tabName, slug] of Object.entries(VIEWS)) {
    const rankings = parseRankingTable(
      htmlByTab[tabName],
      tabName,
      playerRegistry
    );

    if (rankings.length === 0) {
      throw new Error(
        `No players parsed from "${tabName}" — sheet layout may have changed`
      );
    }

    views[slug] = rankings;
    console.log(`  ${rankings.length} players in "${tabName}"`);
  }

  const past = parsePastEvents(htmlByTab["Past Events"], playerRegistry);
  const upcoming = parseUpcomingEvents(htmlByTab["Upcoming Events"]);
  const resultsByEvent = parseEventLog(htmlByTab["Event Log"], playerRegistry);
  assertUniqueIds(past, "past event");
  assertUniqueIds(upcoming, "upcoming event");
  const pastEventIds = new Set(past.map((event) => event.id));
  const unmatchedResultDates = [...resultsByEvent.keys()].filter(
    (eventId) => !pastEventIds.has(eventId)
  );

  if (unmatchedResultDates.length > 0) {
    throw new Error(
      `Results exist without matching Past Events rows: ${unmatchedResultDates.join(
        ", "
      )}`
    );
  }

  for (const event of past) {
    event.results = (resultsByEvent.get(event.id) ?? []).sort(
      (a, b) => a.place - b.place
    );
  }

  past.sort((a, b) => b.date.localeCompare(a.date));
  upcoming.sort((a, b) => a.date.localeCompare(b.date));
  const events = { upcoming, past };
  console.log(`  ${upcoming.length} upcoming events`);
  console.log(`  ${past.length} past events`);

  const data = {
    scrapedAt: new Date().toISOString(),
    source: BASE,
    views,
    events,
  };

  // No-op if the rankings are unchanged, so the hourly workflow only commits
  // and redeploys when the data actually differs. The scrapedAt timestamp is
  // ignored in this comparison since it changes every run.
  if (existsSync(OUTPUT_PATH)) {
    try {
      const previous = JSON.parse(readFileSync(OUTPUT_PATH, "utf8"));
      if (
        JSON.stringify({ views: previous.views, events: previous.events }) ===
        JSON.stringify({ views, events })
      ) {
        console.log(
          "No change in league data — leaving leaderboard.json untouched"
        );
        return;
      }
    } catch {
      // Unreadable/corrupt existing file — fall through and overwrite it.
    }
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
  console.log(`Wrote ${OUTPUT_PATH}`);
}

scrape().catch((err) => {
  console.error("Scrape failed:", err);
  process.exit(1);
});
