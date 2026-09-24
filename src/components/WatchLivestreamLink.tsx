import { Youtube } from "lucide-react";

import ActionLink from "@/components/ActionLink";

export default function WatchLivestreamLink({ href }: { href: string }) {
  return (
    <ActionLink external href={href} size="sm" variant="youtube">
      <Youtube className="h-4 w-4" aria-hidden="true" />
      Watch livestream
    </ActionLink>
  );
}
