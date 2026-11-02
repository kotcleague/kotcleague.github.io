import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import {
  CLUB_65_SOURCE,
  parseQualificationData,
  qualificationIsOpen,
  qualificationUsesLastMonth,
} from "../src/lib/qualification.mjs";
import {
  createQualificationSnapshot,
  createNovemberQualificationSnapshot,
  readPaddleUpLastMonth,
  readClub65Overall,
  writeQualificationSnapshot,
} from "./lib/qualification.mjs";

const dataDirectory = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../public/data"
);
const outputPath = resolve(dataDirectory, "club-match-2026.json");

async function scrape() {
  const now = new Date();
  const confirmClub65 = process.argv.includes("--confirm-club65-october");
  if (process.argv.slice(2).some((arg) => arg !== "--confirm-club65-october")) {
    throw new Error("Unknown qualification scraper argument");
  }
  if (confirmClub65 && !qualificationUsesLastMonth(now)) {
    throw new Error(
      "Manual Club 65 October confirmation is supported only during November 2026"
    );
  }
  if (!qualificationIsOpen(now) && !qualificationUsesLastMonth(now)) {
    if (!existsSync(outputPath)) {
      throw new Error(
        "October qualification snapshot is missing; cannot capture another month's standings"
      );
    }
    parseQualificationData(JSON.parse(readFileSync(outputPath, "utf8")));
    console.log(
      "Outside October/November 2026; retaining saved October qualification standings."
    );
    return;
  }

  const lastMonth = qualificationUsesLastMonth(now);
  const previous = lastMonth
    ? parseQualificationData(JSON.parse(readFileSync(outputPath, "utf8")))
    : null;
  const paddleUp = lastMonth ? await readPaddleUpLastMonth(now) : null;
  if (lastMonth && !confirmClub65) {
    const snapshot = createNovemberQualificationSnapshot(
      previous,
      paddleUp,
      new Date()
    );
    const changed = writeQualificationSnapshot(outputPath, snapshot);
    console.log(
      changed
        ? `Wrote ${outputPath}`
        : "No change in October qualification standings."
    );
    console.log(
      "Paddle Up refreshed from Last Month; saved Club 65 October standings retained."
    );
    return;
  }
  const leaderboard = lastMonth
    ? null
    : JSON.parse(
        readFileSync(resolve(dataDirectory, "leaderboard.json"), "utf8")
      );
  if (!lastMonth && !qualificationIsOpen(new Date(leaderboard.scrapedAt))) {
    throw new Error(
      "Run npm run scrape first: Paddle Up source is not from October 2026"
    );
  }
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  });
  try {
    let club65;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const page = await browser.newPage();
      page.setDefaultTimeout(15_000);
      try {
        await page.goto(CLUB_65_SOURCE, {
          waitUntil: "domcontentloaded",
          timeout: 45_000,
        });
        club65 = await readClub65Overall(page);
        break;
      } catch (error) {
        if (attempt === 3) throw error;
        console.warn(
          `Club 65 attempt ${attempt}/3 failed: ${error.message}; retrying.`
        );
        await new Promise((resolveWait) =>
          setTimeout(resolveWait, 1_000 * attempt)
        );
      } finally {
        await page.close();
      }
    }
    const snapshot = lastMonth
      ? createNovemberQualificationSnapshot(
          previous,
          paddleUp,
          new Date(),
          club65
        )
      : createQualificationSnapshot(leaderboard, club65, new Date());
    mkdirSync(dataDirectory, { recursive: true });
    const changed = writeQualificationSnapshot(outputPath, snapshot);
    console.log(
      changed
        ? `Wrote ${outputPath}`
        : "No change in October qualification standings."
    );
  } finally {
    await browser.close();
  }
}

scrape().catch((error) => {
  console.error(
    "Qualification scrape failed; previous snapshot retained:",
    error
  );
  process.exitCode = 1;
});
