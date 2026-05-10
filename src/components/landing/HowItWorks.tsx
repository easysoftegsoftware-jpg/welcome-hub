const steps = [
  { n: "01", title: "Connect your sources", desc: "Plug in your warehouse, product analytics, billing, and CRM in minutes." },
  { n: "02", title: "Let Lumen learn", desc: "Our AI maps your schema, finds metrics that matter, and builds your starter views." },
  { n: "03", title: "Decide faster", desc: "Ship insights to your whole team. Ask anything, anytime, in plain language." },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-32 border-t border-border relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 size-[400px] rounded-full bg-[var(--neon-magenta)]/10 blur-[120px]" />
      <div className="container mx-auto max-w-6xl px-6 relative">
        <div className="text-center mb-16">
          <div className="text-xs uppercase tracking-widest text-[var(--neon-magenta)] mb-4">How it works</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold">
            From data chaos to clarity in three steps.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-border bg-card p-8">
              <div className="font-display text-6xl font-semibold text-gradient mb-6">{s.n}</div>
              <h3 className="font-display text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
