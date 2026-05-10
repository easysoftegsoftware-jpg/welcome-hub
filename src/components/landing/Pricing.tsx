import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    period: "/forever",
    desc: "For solo builders shipping their first metrics.",
    features: ["Up to 3 dashboards", "1M events / month", "Community support", "Core integrations"],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/user/month",
    desc: "For growing teams that need answers, fast.",
    features: ["Unlimited dashboards", "50M events / month", "AI assistant", "All integrations", "Priority support"],
    cta: "Start trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For teams with scale, security, and compliance needs.",
    features: ["Unlimited everything", "SSO + SAML + RBAC", "Dedicated success manager", "Custom SLAs", "On-prem option"],
    cta: "Contact sales",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-32 border-t border-border">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <div className="text-xs uppercase tracking-widest text-[var(--neon-cyan)] mb-4">Pricing</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold">Simple. Honest. Flexible.</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            No hidden seats, no overage traps. Upgrade or cancel any time.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                t.highlighted
                  ? "border-[var(--neon-cyan)]/60 bg-card glow-cyan"
                  : "border-border bg-card"
              }`}
            >
              {t.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] text-background">
                  Most popular
                </div>
              )}
              <h3 className="font-display text-xl font-semibold">{t.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-semibold">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.period}</span>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="size-4 text-[var(--neon-cyan)] shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-8 w-full ${
                  t.highlighted
                    ? "bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] text-background hover:opacity-90"
                    : ""
                }`}
                variant={t.highlighted ? "default" : "outline"}
              >
                {t.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
