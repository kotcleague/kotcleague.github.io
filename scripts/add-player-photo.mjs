import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const dataPath = resolve(root, "public", "data", "leaderboard.json");
const imageDir = resolve(root, "public", "images", "players");
const [name, photoUrl] = process.argv.slice(2);

if (!name || !photoUrl) {
  throw new Error(
    'Usage: npm run add-player-photo -- "Player Name" "https://image.example/photo.jpg"'
  );
}

const url = new URL(photoUrl);
if (url.protocol !== "https:" && url.protocol !== "http:") {
  throw new Error("Photo URL must use HTTP or HTTPS");
}

const response = await fetch(url);
if (!response.ok) {
  throw new Error(`Photo download failed with HTTP ${response.status}`);
}

const extensionByType = {
  "image/avif": "avif",
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const contentType = response.headers.get("content-type")?.split(";")[0];
const extension = extensionByType[contentType];
if (!extension) {
  throw new Error(
    `Unsupported photo content type "${contentType ?? "unknown"}"`
  );
}

const data = JSON.parse(readFileSync(dataPath, "utf8"));
const normalizedName = name.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US");
const players = Object.values(data.views)
  .flat()
  .filter((player, index, all) => all.findIndex((item) => item.id === player.id) === index);
const player = players.find(
  (candidate) =>
    candidate.name.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US") ===
    normalizedName
);
if (!player) {
  throw new Error(`Player "${name}" was not found in leaderboard.json`);
}

mkdirSync(imageDir, { recursive: true });
const filename = `${player.id}.${extension}`;
writeFileSync(resolve(imageDir, filename), Buffer.from(await response.arrayBuffer()));
for (const ranking of Object.values(data.views)) {
  for (const candidate of ranking) {
    if (candidate.id === player.id) candidate.photoUrl = `images/players/${filename}`;
  }
}
writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Saved ${name}'s photo to public/images/players/${filename}`);
