import { useEffect, useState } from "react";
import ActionLink from "@/components/ActionLink";
import Card from "@/components/Card";
import SectionHeading from "@/components/SectionHeading";
import {
  EditorialTableBody,
  EditorialTableCell,
  EditorialTableHead,
  EditorialTableHeaderCell,
  EditorialTableRow,
} from "@/components/EditorialTable";
import TableShell from "@/components/TableShell";
import { ROUTES } from "@/config/site";
import { CLUB_MATCH } from "@/config/specialEvent";
import {
  leagueCalendarDate,
  parseQualificationData,
  type ClubSnapshot,
  type QualificationData,
} from "@/lib/qualification.mjs";

const DISPLAYED_PLAYERS = 10;

function StandingsCard({ title, club }: { title: string; club: ClubSnapshot }) {
  return (
    <Card className="@container min-w-0 overflow-hidden p-2 sm:p-4">
      <h3 className="font-display text-xl font-semibold tracking-wide sm:text-2xl">
        {title}
      </h3>
      <TableShell className="mt-4">
        <table className="w-full table-fixed text-xs @min-[17rem]:text-sm">
          <caption className="sr-only">
            {title} October 2026 qualification standings
          </caption>
          <EditorialTableHead>
            <tr>
              <EditorialTableHeaderCell className="w-8 px-1 py-2 text-center tracking-normal sm:px-1 @min-[17rem]:w-11">
                #<span className="sr-only"> Rank</span>
              </EditorialTableHeaderCell>
              <EditorialTableHeaderCell className="px-1 py-2 tracking-normal sm:px-1">
                Player
              </EditorialTableHeaderCell>
              <EditorialTableHeaderCell
                alignment="right"
                className="hidden w-16 px-2 py-2 tracking-normal sm:px-2 @min-[17rem]:table-cell"
              >
                Points
              </EditorialTableHeaderCell>
            </tr>
          </EditorialTableHead>
          <EditorialTableBody>
            {club.rows.slice(0, DISPLAYED_PLAYERS).map((row) => (
              <EditorialTableRow key={row.name}>
                <EditorialTableCell
                  numeric
                  className="px-1 py-3 text-center align-top sm:px-1 sm:py-3"
                >
                  {row.rank}
                </EditorialTableCell>
                <EditorialTableCell className="px-1 py-3 align-top font-semibold leading-5 [overflow-wrap:anywhere] sm:px-1 sm:py-3">
                  {row.name}
                </EditorialTableCell>
                <EditorialTableCell
                  alignment="right"
                  score
                  className="hidden px-2 py-3 text-base sm:px-2 sm:py-3 sm:text-lg @min-[17rem]:table-cell"
                >
                  {row.points}
                </EditorialTableCell>
              </EditorialTableRow>
            ))}
          </EditorialTableBody>
        </table>
      </TableShell>
      <ActionLink
        href={club.source}
        size="sm"
        variant="quiet"
        className="mt-2 text-[0.65rem] tracking-normal"
      >
        Source leaderboard
      </ActionLink>
      <details className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
        <summary className="cursor-pointer font-semibold focus-visible:outline-2 focus-visible:outline-blue">
          Scoring and eligibility notes
        </summary>
        <div className="mt-2 space-y-2">
          {club.notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      </details>
    </Card>
  );
}

export default function QualificationStandings() {
  const [data, setData] = useState<QualificationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void fetch(`${import.meta.env.BASE_URL}data/club-match-2026.json`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(parseQualificationData)
      .then(setData)
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            reason instanceof Error ? reason.message : "Unknown snapshot error"
          );
        }
      });
    return () => controller.abort();
  }, []);

  const saved = leagueCalendarDate() > "2026-10-31";
  return (
    <section aria-labelledby="qualification-standings">
      <SectionHeading id="qualification-standings" eyebrow="Qualification">
        October 2026 standings
      </SectionHeading>
      <p className="mb-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Top {DISPLAYED_PLAYERS} from each club. The top four get first invites;
        declines move invitations down that club&apos;s leaderboard.
        {saved && " Saved October standings."}
      </p>
      {error ? (
        <Card className="p-5" role="alert">
          <p className="font-semibold">Qualification standings unavailable</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Could not load the October snapshots ({error}). Check the source
            leaderboards instead.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <ActionLink href={ROUTES.rankings} variant="quiet" size="sm">
              Paddle Up leaderboard
            </ActionLink>
            <ActionLink href={CLUB_MATCH.club65Url} variant="quiet" size="sm">
              Club 65 leaderboard
            </ActionLink>
          </div>
        </Card>
      ) : data ? (
        <div className="grid grid-cols-2 items-start gap-2 sm:gap-4">
          <StandingsCard title="Paddle Up" club={data.clubs["paddle-up"]} />
          <StandingsCard title="Club 65" club={data.clubs["club-65"]} />
        </div>
      ) : (
        <p role="status" className="text-sm text-slate-500 dark:text-slate-400">
          Loading October qualification standings…
        </p>
      )}
    </section>
  );
}
