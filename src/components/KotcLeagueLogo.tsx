export default function KotcLeagueLogo({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-baseline gap-2 font-display font-extrabold uppercase leading-none tracking-[0.08em] text-white ${className}`}
      aria-label="KOTC League"
    >
      <span className="text-2xl sm:text-3xl">KOTC</span>
      <span className="text-sm tracking-[0.18em] text-blue-300 sm:text-base">
        League
      </span>
    </span>
  );
}
