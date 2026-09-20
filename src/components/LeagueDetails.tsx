import {
  CalendarDays,
  CircleDollarSign,
  Clock3,
  MapPin,
  Users,
} from "lucide-react";
import ActionLink from "@/components/ActionLink";
import {
  EditorialTableBody,
  EditorialTableCell,
  EditorialTableHead,
  EditorialTableHeaderCell,
  EditorialTableRow,
} from "@/components/EditorialTable";
import Footer from "@/components/Footer";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import TableShell from "@/components/TableShell";
import { formatInteger } from "@/lib/format";
import { META_LABEL_ACCENT } from "@/lib/styles";

interface LeagueDetailsProps {
  leaderboardUrl: string;
}

const EVENT_POINTS = [
  { court: 1, win: 1000, loss: 200 },
  { court: 2, win: 715, loss: 143 },
  { court: 3, win: 510, loss: 102 },
  { court: 4, win: 365, loss: 73 },
];

const LEADERBOARD_POINTS = [
  { standing: "1st", two: 1000, five: 2500 },
  { standing: "2nd", two: 800, five: 2000 },
  { standing: "3rd", two: 600, five: 1500 },
  { standing: "5th", two: 400, five: 1000 },
  { standing: "8th", two: 200, five: 500 },
  { standing: "11th", two: 100, five: 250 },
];

const LEAGUE_FACTS = [
  {
    icon: Users,
    label: "Players",
    lines: ["4.0+ players", "Competitive play"],
  },
  {
    icon: CalendarDays,
    label: "When",
    lines: ["Thursdays", "8:00–10:00 PM"],
  },
  {
    icon: MapPin,
    label: "Where",
    lines: ["Paddle Up Pickleball Club", "Chesterfield"],
  },
  {
    icon: CircleDollarSign,
    label: "Cost",
    lines: ["Members $9", "Non-members $19"],
    note: "Plus tax",
  },
];

const LEAGUE_STEPS = [
  {
    title: "Start on your assigned court",
    description: "Your leaderboard standing sets your starting court.",
  },
  {
    title: "Play and move",
    description: "Game Maker tracks scores, partners, and court movement.",
  },
  {
    title: "Earn leaderboard points",
    description: "Your final event finish determines your league points.",
  },
  {
    title: "Compete for a free month",
    description: "The top three at month's end play next month free.",
  },
] as const;

export default function LeagueDetails({ leaderboardUrl }: LeagueDetailsProps) {
  return (
    <main>
      <PageHeader
        eyebrow="King of the Court"
        description="How league nights run and how event results become leaderboard points."
      >
        League Format
      </PageHeader>

      <PageContent className="space-y-12">
        <section aria-labelledby="quick-facts">
          <SectionHeading
            eyebrow="League essentials"
            id="quick-facts"
            prominent
          >
            At a glance
          </SectionHeading>
          <div className="border-y border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {LEAGUE_FACTS.map(({ icon: Icon, label, lines, note }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 border-b border-slate-200 px-4 py-5 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0 dark:border-slate-800"
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue dark:text-blue-300" />
                  <div>
                    <span className={`${META_LABEL_ACCENT} block`}>
                      {label}
                    </span>
                    <span className="mt-1 block text-sm font-semibold leading-5">
                      {lines.map((line) => (
                        <span className="block" key={line}>
                          {line}
                        </span>
                      ))}
                    </span>
                    {note && (
                      <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                        {note}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3 border-t border-slate-200 px-4 py-4 dark:border-slate-800">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-blue dark:text-blue-300" />
              <p className="text-sm leading-5 text-slate-600 dark:text-slate-300">
                <strong className="text-ink dark:text-white">Scoring:</strong>{" "}
                rally scoring to 21, win by 1, no freeze. Enter scores in Game
                Maker. KOTC events are not DUPR-rated.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="league-flow">
          <SectionHeading eyebrow="League flow" id="league-flow" prominent>
            How it works
          </SectionHeading>
          <ol className="grid grid-cols-1 gap-5 border-y border-slate-200 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 dark:border-slate-800">
            {LEAGUE_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="relative flex gap-3 lg:px-5 lg:first:pl-0 lg:last:pr-0"
              >
                <span className="font-display flex h-7 w-7 shrink-0 items-center justify-center border border-blue/30 bg-blue/[0.06] text-sm font-bold text-blue dark:border-blue/50 dark:bg-blue/10 dark:text-blue-300">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-ink dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              See where you stand before your next event.
            </p>
            <ActionLink href={leaderboardUrl} size="sm">
              View leaderboard
            </ActionLink>
          </div>
        </section>

        <section aria-labelledby="points-reference">
          <SectionHeading
            eyebrow="Game Maker points"
            id="points-reference"
            prominent
          >
            Points by court
          </SectionHeading>
          <p className="mb-6 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Use this as a reference, not a rulebook. Court 1 is worth the most;
            each lower court is worth about 71% of the court above it. Game
            Maker orders event standings by GM points, then win percentage,
            head-to-head, point differential, and head-to-head point
            differential.
          </p>
          <TableShell>
            <table className="w-full">
              <EditorialTableHead>
                <tr>
                  <EditorialTableHeaderCell>Court</EditorialTableHeaderCell>
                  <EditorialTableHeaderCell alignment="right">
                    Win
                  </EditorialTableHeaderCell>
                  <EditorialTableHeaderCell alignment="right">
                    Loss
                  </EditorialTableHeaderCell>
                </tr>
              </EditorialTableHead>
              <EditorialTableBody className="text-base font-semibold">
                {EVENT_POINTS.map((row) => (
                  <EditorialTableRow key={row.court}>
                    <EditorialTableCell className="font-semibold">
                      {row.court}
                    </EditorialTableCell>
                    <EditorialTableCell alignment="right" numeric>
                      {formatInteger(row.win)}
                    </EditorialTableCell>
                    <EditorialTableCell alignment="right" numeric>
                      {formatInteger(row.loss)}
                    </EditorialTableCell>
                  </EditorialTableRow>
                ))}
              </EditorialTableBody>
            </table>
          </TableShell>
        </section>

        <section aria-labelledby="leaderboard-points">
          <SectionHeading
            eyebrow="Leaderboard points"
            id="leaderboard-points"
            prominent
          >
            Points by finish
          </SectionHeading>
          <p className="mb-6 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Awards scale with the number of courts. First place earns the
            maximum; second earns 80%; third earns 60%; awards then decrease
            through the rest of the field.
          </p>
          <TableShell className="overflow-hidden">
            <table className="w-full table-fixed">
              <EditorialTableHead>
                <tr>
                  <EditorialTableHeaderCell
                    density="compact"
                    className="w-[28%]"
                  >
                    GM standing
                  </EditorialTableHeaderCell>
                  <EditorialTableHeaderCell alignment="right" density="compact">
                    2 courts
                  </EditorialTableHeaderCell>
                  <EditorialTableHeaderCell alignment="right" density="compact">
                    5 courts
                  </EditorialTableHeaderCell>
                </tr>
              </EditorialTableHead>
              <EditorialTableBody className="text-base font-semibold">
                {LEADERBOARD_POINTS.map((row) => (
                  <EditorialTableRow key={row.standing}>
                    <EditorialTableCell
                      density="compact"
                      className="font-semibold"
                    >
                      {row.standing}
                    </EditorialTableCell>
                    <EditorialTableCell
                      alignment="right"
                      density="compact"
                      numeric
                    >
                      {formatInteger(row.two)}
                    </EditorialTableCell>
                    <EditorialTableCell
                      alignment="right"
                      density="compact"
                      numeric
                    >
                      {formatInteger(row.five)}
                    </EditorialTableCell>
                  </EditorialTableRow>
                ))}
              </EditorialTableBody>
            </table>
          </TableShell>
        </section>
      </PageContent>

      <Footer />
    </main>
  );
}
