import { twMerge } from "tailwind-merge";
import { TAB_LIST, tabClass } from "@/lib/styles";

interface PageTab {
  active: boolean;
  href: string;
  label: string;
}

export default function PageTabs({
  ariaLabel,
  tabs,
}: {
  ariaLabel: string;
  tabs: PageTab[];
}) {
  return (
    <nav
      aria-label={ariaLabel}
      className={twMerge(TAB_LIST, "flex w-full sm:inline-flex sm:w-auto")}
    >
      {tabs.map((tab) => (
        <a
          key={tab.href}
          href={tab.href}
          className={twMerge(
            tabClass(tab.active),
            "min-w-0 flex-1 whitespace-normal px-2 text-[0.6rem] leading-tight tracking-[0.06em] sm:flex-none sm:whitespace-nowrap sm:px-4 sm:text-xs sm:tracking-[0.1em]"
          )}
          aria-current={tab.active ? "page" : undefined}
        >
          {tab.label}
        </a>
      ))}
    </nav>
  );
}
