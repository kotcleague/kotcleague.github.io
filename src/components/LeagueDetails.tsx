import { CalendarDays, CircleDollarSign, MapPin, Users } from "lucide-react";
import {
  EditorialTableBody,
  EditorialTableHead,
  EditorialTableRow,
} from "@/components/EditorialTable";
import Footer from "@/components/Footer";
import MonthlyPrizes from "@/components/MonthlyPrizes";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import SectionAction from "@/components/SectionAction";
import SectionHeading from "@/components/SectionHeading";
import TableShell from "@/components/TableShell";
import { ROUTES } from "@/config/site";

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
    value: "Tuesdays & Thursdays, 8:00–10:00 PM",
  },
  { icon: MapPin, label: "Where", value: "Paddle Up Pickleball Club Chesterfield" },
  {
    icon: CircleDollarSign,
    label: "Cost",
    value: "$9 per event for members, $19 per event for non-members",
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

export default function LeagueDetails({ leaderboardUrl }: LeagueDetailsProps) {
  return (
    <main>
      <PageHeader eyebrow="King of the Court">League Format</PageHeader>

      <PageContent className="space-y-16">
        <section>
          <div className="grid grid-cols-1 border-y border-slate-300 sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-700">
            {LEAGUE_FACTS.map(({ icon: Icon, label, value }) => (
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
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <MonthlyPrizes />

        <section>
          <SectionHeading eyebrow="Overview" prominent>
            How the league works
          </SectionHeading>
          <div className="border-y border-slate-300 dark:border-slate-700">
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {LEAGUE_STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="relative border-b border-slate-200 p-5 sm:border-r lg:border-b-0 lg:p-6 lg:last:border-r-0 dark:border-slate-800"
                >
                  <span className="font-display block text-5xl font-bold leading-none text-blue/20 dark:text-blue-300/25">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-ink dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-5 text-slate-500 dark:text-slate-400">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
            <SectionAction action="View leaderboard" href={leaderboardUrl}>
              See where you stand
            </SectionAction>
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Event format" prominent>
            How each league night runs
          </SectionHeading>
          <div className="border-y border-slate-300 dark:border-slate-700">
            <dl className="grid grid-cols-1 sm:grid-cols-2">
              {EVENT_DETAILS.map(({ term, description }, index) => (
                <div
                  key={term}
                  className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-slate-200 py-5 sm:px-5 sm:[&:nth-child(odd)]:border-r dark:border-slate-800"
                >
                  <span className="font-display text-xl font-bold text-blue dark:text-blue-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <dt className="text-base font-semibold text-ink dark:text-white">
                      {term}
                    </dt>
                    <dd className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                      {description}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
            <SectionAction action="View schedule" href={ROUTES.schedule}>
              Find your next league night
            </SectionAction>
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Game Maker points" prominent>
            Points by court
          </SectionHeading>
          <p className="mb-6 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            On Court 1, a win earns 1,000 GM points and a loss earns 200. Each
            lower court is worth about 71% of the court above it. Event
            standings are calculated in Game Maker and ordered by GM points,
            with win percentage, head-to-head results, point differential, and
            head-to-head point differential used as tiebreakers, in that order.
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

        <section>
          <SectionHeading eyebrow="Leaderboard points" prominent>
            From event finish to league points
          </SectionHeading>
          <p className="mb-6 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Event points scale with the number of courts: first place earns the
            maximum award, second earns 80%, third earns 60%, and awards
            gradually decrease through the rest of the field.
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
