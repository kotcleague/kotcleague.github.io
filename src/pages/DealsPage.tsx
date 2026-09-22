import ActionLink from "@/components/ActionLink";
import Footer from "@/components/Footer";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import { META_LABEL_ACCENT } from "@/lib/styles";

interface Deal {
  category: string;
  code: string;
  description: string;
  discount: string;
  href: string;
  imageAlt: string;
  imageUrl: string;
  name: string;
}

const DEALS: Deal[] = [
  {
    category: "Paddle",
    code: "Ola",
    description:
      "A durable foam-core paddle with a long-lasting grit surface and consistent all-court performance.",
    discount: "10% off",
    href: "https://808pickle.com/products/j6cr-crystal-blue-endurance-surface%E2%84%A2-pre-order",
    imageAlt: "J6CR Crystal Blue pickleball paddle",
    imageUrl: "/images/deals/honolulu-j6cr-paddle.webp",
    name: "J6CR CRYSTAL BLUE™ ENDURANCE SURFACE™",
  },
  {
    category: "Shoes",
    code: "Ola",
    description:
      "Court shoes selected for durability and dependable support during regular league play.",
    discount: "10% off",
    href: "https://montispickleball.com",
    imageAlt: "Blue Montis Drop 1.0 pickleball shoe",
    imageUrl: "/images/deals/montis-drop-1-shoes.webp",
    name: "Montis Pickleball Shoes",
  },
  {
    category: "Grips",
    code: "tobiola15",
    description:
      "Tacky, comfortable overgrips that provide a secure feel through extended play.",
    discount: "15% off",
    href: "https://bodhiperformance.com/collections/bodhi-grip-premium-overgrips/products/bodhi-grips-premium-pickleball-overgrips",
    imageAlt: "Blue Bodhi pickleball overgrips",
    imageUrl: "/images/deals/bodhi-pickleball-grips.webp",
    name: "Bodhi Pickleball Grips",
  },
];

function DealCard({ deal }: { deal: Deal }) {
  return (
    <article className="grid grid-cols-[6.5rem_minmax(0,1fr)] overflow-hidden border border-slate-200 bg-white sm:grid-cols-[8rem_minmax(0,1fr)_10rem] dark:border-scoreboard dark:bg-ink">
      <div className="overflow-hidden border-r border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
        <img
          src={deal.imageUrl}
          alt={deal.imageAlt}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 p-4 sm:p-5">
        <p className={META_LABEL_ACCENT}>{deal.category}</p>
        <h2 className="font-display mt-1.5 text-xl font-bold uppercase leading-none sm:text-2xl">
          {deal.name}
        </h2>
        <p className="mt-2 text-sm leading-5 text-slate-500 dark:text-slate-400">
          {deal.description}
        </p>
      </div>
      <div className="col-span-2 flex items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/70 px-4 py-3 sm:col-span-1 sm:flex-col sm:items-stretch sm:justify-center sm:border-l sm:border-t-0 dark:border-slate-800 dark:bg-white/[0.025]">
        <div className="sm:text-center">
          <p className="font-display text-xl font-bold text-blue dark:text-blue-300">
            {deal.discount}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Use code{" "}
            <span className="font-mono text-sm font-bold text-ink dark:text-white">
              {deal.code}
            </span>
          </p>
        </div>
        <ActionLink
          href={deal.href}
          external
          className="shrink-0"
          size="sm"
          variant="secondary"
          aria-label={`View ${deal.name} deal`}
        >
          See product
        </ActionLink>
      </div>
    </article>
  );
}

export default function DealsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Player perks"
        description="Save on gear we recommend. Using these codes also helps support future events."
      >
        Pickleball deals
      </PageHeader>

      <PageContent>
        <section aria-labelledby="deals-heading">
          <div className="mb-5 flex items-end justify-between gap-4">
            <SectionHeading eyebrow="Current offers" id="deals-heading">
              Gear for the court
            </SectionHeading>
            <p className="shrink-0 pb-1 text-sm text-slate-500 dark:text-slate-400">
              3 court picks
            </p>
          </div>

          <div className="grid gap-3">
            {DEALS.map((deal) => (
              <DealCard key={deal.name} deal={deal} />
            ))}
          </div>
        </section>

        <p className="mt-5 max-w-2xl text-xs leading-5 text-slate-400 dark:text-slate-500">
          No pressure to buy. These are simply partner discounts we think players
          may find useful.
        </p>
      </PageContent>

      <Footer />
    </main>
  );
}
