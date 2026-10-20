export const QUALIFICATION_MONTH: "2026-10";
export const CLUB_65_SOURCE: string;
export function leagueCalendarDate(now?: Date): string;
export function qualificationIsOpen(now?: Date): boolean;

export interface QualificationRow {
  rank: string;
  name: string;
  points: number;
}

export interface Club65Row extends QualificationRow {
  incompleteWeeks: boolean;
  weeklyPoints: (number | null)[];
  wins: number;
  losses: number;
  differential: number;
}

export interface ClubSnapshot<Row extends QualificationRow = QualificationRow> {
  source: string;
  capturedAt: string;
  notes: string[];
  rows: Row[];
}

export interface QualificationData {
  month: "2026-10";
  clubs: {
    "paddle-up": ClubSnapshot;
    "club-65": ClubSnapshot<Club65Row>;
  };
}

export function parseQualificationData(value: unknown): QualificationData;
