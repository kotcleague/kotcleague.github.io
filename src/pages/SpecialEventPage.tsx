import { CalendarDays, Flag, MapPin, Users } from "lucide-react";
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
import QualificationStandings from "@/components/QualificationStandings";
import QuickFacts from "@/components/QuickFacts";
import SectionHeading from "@/components/SectionHeading";
import TableShell from "@/components/TableShell";
import { ROUTES } from "@/config/site";
import { CLUB_MATCH } from "@/config/specialEvent";

const EVENT_FACTS = [
  {
    icon: Users,
    label: "Players",
    lines: ["4 per club"],
    note: "Top players on each leaderboard get first invites.",
  },
  {
    icon: CalendarDays,
    label: "When",
    lines: ["Sunday, November 1, 2026", `${CLUB_MATCH.time} CT`],
  },
  {
    icon: MapPin,
    label: "Where",
    lines: [CLUB_MATCH.location],
  },
  { icon: Flag, label: "Format", lines: ["6 doubles games"] },
] as const;

export default function SpecialEventPage() {
  return (
    <main>
      <PageHeader eyebrow="KOTC League · Club match">
        <span className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 text-center sm:gap-6">
          <span>Paddle Up</span>{" "}
          <span className="text-2xl text-blue sm:text-3xl dark:text-blue-300">
            vs
          </span>{" "}
          <span>Club 65</span>
        </span>
      </PageHeader>
      <PageContent className="space-y-8 sm:space-y-10">
        <section aria-labelledby="event-essentials">
          <SectionHeading id="event-essentials">At a glance</SectionHeading>
          <QuickFacts
            facts={EVENT_FACTS}
            variant="compact"
            footer={
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                <strong className="text-ink dark:text-white">Rules:</strong>{" "}
                Traditional scoring to 11, win by 2. Switch sides when the first
                team reaches 6. Lifetime ball. Most game wins takes the match; a
                3–3 tie goes to a DreamBreaker.
              </p>
            }
          />
        </section>

        <section aria-labelledby="game-lineup">
          <SectionHeading
            id="game-lineup"
            description="Each player partners with every teammate once. P1–P4 identify each club’s players."
          >
            Game lineup
          </SectionHeading>
          <TableShell>
            <table className="w-full text-sm">
              <caption className="sr-only">Six squads matchups</caption>
              <EditorialTableHead>
                <tr>
                  <EditorialTableHeaderCell>Game</EditorialTableHeaderCell>
                  <EditorialTableHeaderCell>Paddle Up</EditorialTableHeaderCell>
                  <EditorialTableHeaderCell>Club 65</EditorialTableHeaderCell>
                </tr>
              </EditorialTableHead>
              <EditorialTableBody>
                {CLUB_MATCH.pairings.map((pair, index) => (
                  <EditorialTableRow key={pair.join("-")}>
                    <EditorialTableCell numeric>{index + 1}</EditorialTableCell>
                    <EditorialTableCell>{pair.join(" + ")}</EditorialTableCell>
                    <EditorialTableCell>{pair.join(" + ")}</EditorialTableCell>
                  </EditorialTableRow>
                ))}
              </EditorialTableBody>
            </table>
          </TableShell>
        </section>

        <QualificationStandings />
        <ActionLink href={ROUTES.schedule} variant="secondary">
          Back to schedule
        </ActionLink>
      </PageContent>
      <Footer />
    </main>
  );
}
