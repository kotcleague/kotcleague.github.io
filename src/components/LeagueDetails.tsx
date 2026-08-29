import { CalendarDays, CircleDollarSign, MapPin, Users } from "lucide-react";
import Eyebrow from "@/components/Eyebrow";
import Footer from "@/components/Footer";
import MonthlyPrizes from "@/components/MonthlyPrizes";
import PageHeader from "@/components/PageHeader";

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
    label: "Who",
    value:
      "4.0+ players looking for consistent, competitive play in a non-DUPR-rated format.",
  },
  {
    icon: CalendarDays,
    label: "When",
    value: "Select Mondays, Tuesdays & Thursdays, 8:00–10:00 PM",
  },
  { icon: MapPin, label: "Where", value: "Paddle Up Chesterfield" },
  {
    icon: CircleDollarSign,
    label: "Cost",
    value: "$12 per event for members, $22 per event for non-members",
  },
];

const EVENT_DETAILS = [
  {
    term: "Schedule",
    description: "10-minute warmup, then 1 hour 50 minutes of play.",
  },
  {
    term: "Initial seeding",
    description:
      "Initial KOTC seeding is determined in this order: past 30-day rank, all-time rank, DUPR, then random draw.",
  },
  {
    term: "Scoring",
    description:
      "Enter scores in the Game Maker app. Rally scoring to 21, win by 1, no freeze. Not DUPR-rated.",
  },
  {
    term: "Court movement",
    description:
      "Game Maker directs movement and partner rotations: winners move up and losers move down.",
  },
];

const LEAGUE_STEPS = [
  {
    title: "Starting court assignment",
    description:
      "Leaderboard standings set each event's initial courts, with top-ranked players starting highest.",
  },
  {
    title: "Track the event",
    description:
      "Game Maker handles score entry, court movement, and event standings.",
  },
  {
    title: "Earn points",
    description:
      "Final event standings determine how many leaderboard points each player earns.",
  },
  {
    title: "Win monthly prizes",
    description:
      "At month's end, the top players on the leaderboard receive prizes.",
  },
] as const;

function SectionHeading({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
        {children}
      </h2>
    </div>
  );
}

export default function LeagueDetails({ leaderboardUrl }: LeagueDetailsProps) {
  return (
    <main>
      <PageHeader eyebrow="King of the Court">League Format</PageHeader>

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-10 sm:px-6 sm:py-14">
        <section>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 lg:grid-cols-4 dark:border-slate-800 dark:bg-slate-800">
            {LEAGUE_FACTS.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-3 bg-white px-4 py-3.5 dark:bg-slate-900"
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
                <div>
                  <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold leading-5">
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <MonthlyPrizes />

        <section>
          <SectionHeading eyebrow="Overview">
            How the league works
          </SectionHeading>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <ol className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 lg:grid-cols-4">
              {LEAGUE_STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="bg-white p-3 sm:p-4 dark:bg-slate-900"
                >
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue/10 text-[0.7rem] font-bold text-blue sm:h-7 sm:w-7 sm:text-xs dark:bg-blue/20 dark:text-blue-300">
                    {index + 1}
                  </span>
                  <h3 className="mt-2 text-sm font-bold text-ink sm:mt-3 sm:text-base dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-xs leading-4 text-slate-500 sm:text-sm sm:leading-5 dark:text-slate-400">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
            <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/60">
              <p className="text-sm font-semibold text-ink dark:text-white">
                See where you stand
              </p>
              <a
                href={leaderboardUrl}
                className="inline-flex w-fit rounded-lg bg-blue px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
              >
                View leaderboard
              </a>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <Eyebrow>Event format</Eyebrow>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              What to expect
            </h2>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
            <dl className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800">
              {EVENT_DETAILS.map(({ term, description }) => (
                <div
                  key={term}
                  className="bg-white p-3 sm:p-4 dark:bg-slate-900"
                >
                  <dt className="text-sm font-semibold text-ink sm:text-base dark:text-white">
                    {term}
                  </dt>
                  <dd className="mt-1 text-xs leading-4 text-slate-500 sm:text-sm sm:leading-5 dark:text-slate-400">
                    {description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Game Maker points">
            Points by court
          </SectionHeading>
          <p className="mb-6 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            On Court 1, a win earns 1,000 GM points and a loss earns 200. Each
            lower court is worth about 71% of the court above it. Event
            standings are calculated in Game Maker and ordered by GM points,
            with win percentage, head-to-head results, point differential, and
            head-to-head point differential used as tiebreakers, in that order.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-800/60">
                <tr>
                  <th className="px-5 py-3 text-left">Court</th>
                  <th className="px-5 py-3 text-right">Win</th>
                  <th className="px-5 py-3 text-right">Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {EVENT_POINTS.map((row) => (
                  <tr key={row.court}>
                    <td className="px-5 py-3 font-semibold">{row.court}</td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {row.win}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {row.loss}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Leaderboard points">
            From event finish to league points
          </SectionHeading>
          <p className="mb-6 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Event points scale with the number of courts: first place earns the
            maximum award, second earns 80%, third earns 60%, and awards
            gradually decrease through the rest of the field.
          </p>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full table-fixed">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-800/60">
                <tr>
                  <th className="w-[28%] px-2 py-3 text-left sm:px-5">
                    GM standing
                  </th>
                  <th className="px-2 py-3 text-right sm:px-5">2 courts</th>
                  <th className="px-2 py-3 text-right sm:px-5">5 courts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {LEADERBOARD_POINTS.map((row) => (
                  <tr key={row.standing}>
                    <td className="px-2 py-3 font-semibold sm:px-5">
                      {row.standing}
                    </td>
                    <td className="px-2 py-3 text-right tabular-nums sm:px-5">
                      {row.two}
                    </td>
                    <td className="px-2 py-3 text-right tabular-nums sm:px-5">
                      {row.five}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
