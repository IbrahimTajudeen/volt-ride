const brands = [
  "BOSCH",
  "SHIMANO",
  "SAMSUNG SDI",
  "PANASONIC",
  "BROSE",
  "MICHELIN",
  "BAFANG",
  "SRAM",
  "MAGURA",
  "CONTINENTAL",
];

export const BrandsMarquee = () => {
  const loop = [...brands, ...brands];

  return (
    <section className="border-y border-border/60 bg-surface/40 overflow-hidden">
      <div className="container-px mx-auto max-w-7xl py-8">
        <p className="mb-6 text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Trusted by industry-leading partners
        </p>

        <div className="relative overflow-hidden">
          {/* Fade left */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />

          {/* Fade right */}
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

          <div className="flex w-max animate-marquee items-center gap-16 hover:[animation-play-state:paused]">
            {loop.map((brand, index) => (
              <span
                key={index}
                className="whitespace-nowrap font-display text-xl font-bold tracking-[0.2em] text-muted-foreground/70 transition-colors hover:text-foreground md:text-2xl"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};