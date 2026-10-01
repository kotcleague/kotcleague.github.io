import { ArrowRight } from "lucide-react";
import ActionLink from "@/components/ActionLink";
import RegistrationLink from "@/components/RegistrationLink";
import { eventAssignmentsRoute } from "@/config/site";
import type { UpcomingEvent } from "@/types/leaderboard";

export default function EventRegistrationActions({
  event,
}: {
  event: UpcomingEvent;
}) {
  return (
    <div className="grid gap-1 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
      {event.courtReserveUrl && (
        <RegistrationLink href={event.courtReserveUrl} compact>
          Register
        </RegistrationLink>
      )}
      {event.gameMakerUrl && (
        <RegistrationLink href={event.gameMakerUrl} compact>
          Game Maker
        </RegistrationLink>
      )}
      {event.registeredPlayerCount > 0 && (
        <ActionLink
          href={eventAssignmentsRoute(event.id)}
          size="sm"
          variant="secondary"
        >
          Initial assignments
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </ActionLink>
      )}
    </div>
  );
}
