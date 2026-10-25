import { CLUB_65_SOURCE, leagueCalendarDate } from "@/lib/qualification.mjs";

export const CLUB_MATCH = {
  id: "paddle-up-vs-club-65-2026",
  title: "KOTC League: Paddle Up vs Club 65",
  date: "2026-11-08",
  time: "6–8 PM",
  location: "Paddle Up Pickleball Club Chesterfield",
  club65Url: CLUB_65_SOURCE,
  pairings: [
    ["P1", "P2"],
    ["P3", "P4"],
    ["P1", "P3"],
    ["P2", "P4"],
    ["P1", "P4"],
    ["P2", "P3"],
  ],
} as const;

export function showClubMatch(now = new Date()) {
  return leagueCalendarDate(now) <= CLUB_MATCH.date;
}
