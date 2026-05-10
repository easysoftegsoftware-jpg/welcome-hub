const quotes = [
  { name: "Maya Chen", role: "VP Growth, Northwind", text: "Lumen replaced four tools and a weekly meeting. Our team finally trusts the numbers." },
  { name: "Daniel Park", role: "CTO, Initech", text: "The AI assistant is uncanny. It catches drops in conversion before our analysts do." },
  { name: "Priya Shah", role: "Head of Data, Globex", text: "Setup took an afternoon. A month in, it feels like a senior analyst on the team." },
];

export function Testimonials() {
  return (
    <section className="py-32 border-t border-border">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="font-display text-4xl md:text-5xl font-semibold mb-16 max-w-2xl">
          Loved by data teams who'd rather build than babysit.
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map((q) => (
            <figure key={q.name} className="rounded-2xl border border-border bg-card p-8 flex flex-col">
              <blockquote className="text-base leading-relaxed flex-1">"{q.text}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-magenta)] flex items-center justify-center font-display font-semibold text-background">
                  {q.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-medium">{q.name}</div>
                  <div className="text-xs text-muted-foreground">{q.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
