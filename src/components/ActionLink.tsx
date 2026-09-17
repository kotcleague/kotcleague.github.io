import { ExternalLink } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

import { actionClass, type ActionSize, type ActionVariant } from "@/lib/styles";

interface ActionLinkProps extends ComponentPropsWithoutRef<"a"> {
  external?: boolean;
  size?: ActionSize;
  variant?: ActionVariant;
}

export default function ActionLink({
  children,
  className,
  external = false,
  size,
  variant,
  ...props
}: ActionLinkProps) {
  return (
    <a
      className={actionClass({ className, size, variant })}
      target={external ? "_blank" : props.target}
      rel={external ? "noopener noreferrer" : props.rel}
      {...props}
    >
      {children}
      {external && <ExternalLink className="h-4 w-4" aria-hidden="true" />}
    </a>
  );
}
