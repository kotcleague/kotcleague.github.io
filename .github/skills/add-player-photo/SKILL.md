---
name: add-player-photo
description: Add a permitted player profile photo to the KOTC site from a player name and image URL.
---

# Add a player photo

Use this skill when the user provides a player name and a direct photo URL.

1. Confirm the user has permission to use the image if that is not already clear.
2. Run `npm run add-player-photo -- "<player name>" "<photo URL>"`.
3. Verify that the image was saved under `public/images/players/` and that the matching entries in `public/data/leaderboard.json` now use the local `images/players/...` path.
4. Run `npm run typecheck`, `npm run lint`, and `npm run build`.
5. Report the changed asset and data file.

The command accepts HTTP(S) URLs, validates the response as a supported image type, derives the filename from the existing player ID, and updates every ranking view for that player. Do not retain the third-party URL in generated leaderboard data.
