const logos = ["Northwind", "Acme", "Globex", "Initech", "Umbrella", "Stark"];

export function LogoCloud() {
  return (
    <section className="py-16 border-y border-border bg-card/30">
      <div className="container mx-auto max-w-6xl px-6">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8">
          Trusted by teams shipping at
        </p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
          {logos.map((l) => (
            <div
              key={l}
              className="text-center font-display text-xl font-semibold text-muted-foreground/70 hover:text-foreground transition-colors"
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
