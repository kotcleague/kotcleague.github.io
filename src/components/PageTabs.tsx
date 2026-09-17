import { tabClass } from "@/lib/styles";

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
      className="scrollbar-hide inline-flex max-w-full overflow-x-auto border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900"
    >
      {tabs.map((tab) => (
        <a
          key={tab.href}
          href={tab.href}
          className={tabClass(tab.active)}
          aria-current={tab.active ? "page" : undefined}
        >
          {tab.label}
        </a>
      ))}
    </nav>
  );
}
