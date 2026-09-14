import {
  CalendarDays,
  CircleDollarSign,
  Clock3,
  MapPin,
  Users,
} from "lucide-react";
import {
  EditorialTableBody,
  EditorialTableHead,
  EditorialTableRow,
} from "@/components/EditorialTable";
import Footer from "@/components/Footer";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import TableShell from "@/components/TableShell";

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
      <PageHeader eyebrow="King of the Court">League Format</PageHeader>

      <PageContent className="space-y-12 sm:space-y-16">
        <section aria-labelledby="quick-facts">
          <div className="overflow-hidden rounded-sm border border-slate-300 bg-white shadow-[0_1px_0_rgba(8,27,42,0.05)] dark:border-slate-700 dark:bg-slate-900">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {LEAGUE_FACTS.map(({ icon: Icon, label, lines, note }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 border-b border-slate-200 px-4 py-5 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0 dark:border-slate-800"
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue dark:text-blue-300" />
                  <div>
                    <span className="font-display block text-sm font-bold uppercase tracking-[0.16em] text-blue dark:text-blue-300">
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
            <div className="flex items-start gap-3 border-t border-blue/30 bg-blue/[0.04] px-4 py-4 dark:border-blue/40 dark:bg-blue/[0.08]">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-blue dark:text-blue-300" />
              <p className="text-sm leading-5 text-slate-600 dark:text-slate-300">
                <strong className="text-ink dark:text-white">Scoring:</strong>{" "}
                rally scoring to 21, win by 1, no freeze. Enter scores in Game
                Maker. KOTC events are not DUPR-rated.
              </p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="league-flow"
          className="rounded-sm border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <h2
              id="league-flow"
              className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl"
            >
              How it works
            </h2>
          </div>
          <ol className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {LEAGUE_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="relative flex gap-3 lg:px-5 lg:first:pl-0 lg:last:pr-0"
              >
                <span className="font-display flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue text-sm font-bold text-white dark:bg-blue-300 dark:text-slate-950">
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
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              See where you stand before your next event.
            </p>
            <a
              href={leaderboardUrl}
              className="inline-flex rounded-sm bg-blue px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue dark:bg-blue-300 dark:text-slate-950 dark:hover:bg-blue-200"
            >
              View leaderboard
            </a>
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
                  <th className="px-5 py-3 text-left">Court</th>
                  <th className="px-5 py-3 text-right">Win</th>
                  <th className="px-5 py-3 text-right">Loss</th>
                </tr>
              </EditorialTableHead>
              <EditorialTableBody className="font-display text-lg font-semibold">
                {EVENT_POINTS.map((row) => (
                  <EditorialTableRow key={row.court}>
                    <td className="px-5 py-3 font-semibold">{row.court}</td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {row.win}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {row.loss}
                    </td>
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
                  <th className="w-[28%] px-2 py-3 text-left sm:px-5">
                    GM standing
                  </th>
                  <th className="px-2 py-3 text-right sm:px-5">2 courts</th>
                  <th className="px-2 py-3 text-right sm:px-5">5 courts</th>
                </tr>
              </EditorialTableHead>
              <EditorialTableBody className="font-display text-lg font-semibold">
                {LEADERBOARD_POINTS.map((row) => (
                  <EditorialTableRow key={row.standing}>
                    <td className="px-2 py-3 font-semibold sm:px-5">
                      {row.standing}
                    </td>
                    <td className="px-2 py-3 text-right tabular-nums sm:px-5">
                      {row.two}
                    </td>
                    <td className="px-2 py-3 text-right tabular-nums sm:px-5">
                      {row.five}
                    </td>
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
