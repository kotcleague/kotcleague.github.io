import { readFileSync } from "node:fs";
import { parseQualificationData } from "../src/lib/qualification.mjs";

try {
  if (process.argv.length > 2) {
    throw new Error(
      "October qualification standings are frozen; refresh arguments are no longer supported"
    );
  }
  const path = new URL("../public/data/club-match-2026.json", import.meta.url);
  parseQualificationData(JSON.parse(readFileSync(path, "utf8")));
  console.log(
    "October qualification standings are frozen. Validated saved data; no requests or writes performed."
  );
} catch (error) {
  console.error("Frozen qualification snapshot validation failed:", error);
  process.exitCode = 1;
}
