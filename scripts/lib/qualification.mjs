import {
  existsSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import {
  CLUB_65_SOURCE,
  QUALIFICATION_MONTH,
  parseQualificationData,
  qualificationIsOpen,
} from "../../src/lib/qualification.mjs";

const HEADERS = [
  "#",
  "Player",
  "Wk1Pts",
  "Wk2Pts",
  "Wk3Pts",
  "Wk4Pts",
  "Points",
  "W",
  "L",
  "+/-",
];

function numericCell(value, context) {
  if (typeof value !== "string" || !/^[+-]?\d+(?:\.\d+)?$/.test(value.trim())) {
    throw new Error(`Invalid ${context}: ${value}`);
  }
  return Number(value);
}

export function parseClub65Table({ grids, notes }) {
  if (
    !Array.isArray(grids) ||
    JSON.stringify(grids[0]) !== JSON.stringify(HEADERS) ||
    grids.length < 2 ||
    !Array.isArray(notes) ||
    !notes.some((note) => /best 3 weeks/i.test(note)) ||
    !notes.some((note) => /T = still tied/i.test(note))
  ) {
    throw new Error(
      "Club 65 Overall standings headers or scoring notes changed"
    );
  }

  return {
    notes: notes.filter((note) => !/^Weeks /i.test(note)),
    rows: grids.slice(1).map((cells) => {
      if (cells.length !== HEADERS.length) {
        throw new Error("Club 65 standings row has unexpected columns");
      }
      const rawName = cells[1].trim();
      const incompleteWeeks = rawName.endsWith("*");
      return {
        rank: cells[0],
        name: rawName.replace(/\s*\*$/, "").trim(),
        incompleteWeeks,
        weeklyPoints: cells
          .slice(2, 6)
          .map((cell) =>
            cell === "\u2013" ? null : numericCell(cell, "weekly points")
          ),
        points: numericCell(cells[6], "points"),
        wins: numericCell(cells[7], "wins"),
        losses: numericCell(cells[8], "losses"),
        differential: numericCell(cells[9], "differential"),
      };
    }),
  };
}

export async function readClub65Overall(page) {
  await page
    .getByRole("heading", { name: "Club65 Wednesday KOTC League", exact: true })
    .waitFor({ timeout: 45_000 });
  const overall = page.getByRole("tab", { name: "Overall", exact: true });
  await overall.click();
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll('[role="tab"]')].some(
        (tab) =>
          tab.textContent.trim() === "Overall" &&
          tab.getAttribute("aria-selected") === "true"
      ),
    undefined,
    { timeout: 15_000 }
  );
  const heading = page.getByRole("heading", {
    name: /^Overall \u00b7 Monthly winners$/i,
  });
  await heading.waitFor({ timeout: 15_000 });
  const table = await heading.evaluate((element) => {
    const section = element.parentElement.parentElement;
    return {
      grids: [
        ...section.querySelectorAll('[style*="grid-template-columns"]'),
      ].map((grid) =>
        [...grid.children].map((cell) => cell.textContent.trim())
      ),
      notes: [...section.querySelectorAll("p")].map((note) =>
        note.textContent.trim()
      ),
    };
  });
  if ((await overall.getAttribute("aria-selected")) !== "true") {
    throw new Error("Club 65 Overall tab lost selection during extraction");
  }
  return parseClub65Table(table);
}

export function createQualificationSnapshot(
  leaderboard,
  club65,
  now = new Date()
) {
  if (
    !qualificationIsOpen(now) ||
    !qualificationIsOpen(new Date(leaderboard.scrapedAt))
  ) {
    throw new Error(
      "Paddle Up source and capture must both belong to October 2026"
    );
  }
  const players = leaderboard.views?.["current-month"];
  if (!Array.isArray(players) || players.length === 0) {
    throw new Error("Paddle Up October standings are missing");
  }
  return parseQualificationData({
    month: QUALIFICATION_MONTH,
    clubs: {
      "paddle-up": {
        source: "https://kotcleague.github.io/#/",
        capturedAt: leaderboard.scrapedAt,
        notes: [
          "Paddle Up October league points. Each club uses its own scoring system.",
        ],
        rows: players.map((player) => ({
          rank: String(player.rank),
          name: player.name,
          points: player.points,
        })),
      },
      "club-65": {
        source: CLUB_65_SOURCE,
        capturedAt: now.toISOString(),
        ...club65,
      },
    },
  });
}

function comparable(data) {
  return JSON.stringify({
    month: data.month,
    clubs: Object.fromEntries(
      Object.entries(data.clubs).map(([id, club]) => [
        id,
        { source: club.source, notes: club.notes, rows: club.rows },
      ])
    ),
  });
}

export function writeQualificationSnapshot(path, snapshot) {
  const validated = parseQualificationData(snapshot);
  if (existsSync(path)) {
    const previous = parseQualificationData(
      JSON.parse(readFileSync(path, "utf8"))
    );
    if (comparable(previous) === comparable(validated)) return false;
    for (const id of ["paddle-up", "club-65"]) {
      if (
        JSON.stringify(previous.clubs[id].rows) ===
          JSON.stringify(validated.clubs[id].rows) &&
        JSON.stringify(previous.clubs[id].notes) ===
          JSON.stringify(validated.clubs[id].notes)
      ) {
        validated.clubs[id].capturedAt = previous.clubs[id].capturedAt;
      }
    }
  }
  const temporaryPath = `${path}.tmp`;
  try {
    writeFileSync(temporaryPath, `${JSON.stringify(validated, null, 2)}\n`);
    renameSync(temporaryPath, path);
  } finally {
    if (existsSync(temporaryPath)) unlinkSync(temporaryPath);
  }
  return true;
}
