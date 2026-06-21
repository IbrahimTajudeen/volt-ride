const brands = [
  "BOSCH", "SHIMANO", "SAMSUNG SDI", "PANASONIC", "BROSE",
  "MICHELIN", "BAFANG", "SRAM", "MAGURA", "CONTINENTAL",
];

export const BrandsMarquee = () => {
  const loop = [...brands, ...brands];
  return (
    <section className="border-y border-border/60 bg-surface/40 overflow-hidden">
      <div className="container-px mx-auto max-w-7xl py-8">
        <p className="text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
          Trusted by industry-leading partners
        </p>
        <div className="marquee-mask overflow-hidden">
          <div className="marquee-track flex items-center gap-16 w-max">
            {loop.map((b, i) => (
              <span
                key={i}
                className="font-display text-xl md:text-2xl font-bold tracking-[0.2em] text-muted-foreground/70 hover:text-foreground transition-colors whitespace-nowrap"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};