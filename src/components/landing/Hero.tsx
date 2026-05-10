import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, TrendingUp, Activity, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-[var(--neon-cyan)]/10 blur-[120px]" />

      <div className="container mx-auto max-w-6xl px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/50 backdrop-blur-sm text-xs text-muted-foreground mb-8">
            <span className="size-1.5 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
            New — AI insights, now in beta
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[1.05] max-w-4xl">
            See your data{" "}
            <span className="text-gradient">before</span>
            <br />
            it sees you coming.
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Lumen turns scattered metrics into a single, AI-powered command center —
            so your team ships decisions, not dashboards.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] text-background font-medium hover:opacity-90 glow-cyan">
              Start free trial
              <ArrowRight className="ml-1 size-4" />
            </Button>
            <Button size="lg" variant="outline" className="bg-card/50 backdrop-blur">
              <Play className="mr-1 size-4" />
              Watch demo
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required · 14-day free trial
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 relative"
        >
          <div className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-2 shadow-[var(--shadow-elegant)]">
            <div className="rounded-xl bg-background/80 p-6 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-xs text-muted-foreground">Revenue overview</div>
                  <div className="text-3xl font-display font-semibold mt-1">$284,920</div>
                </div>
                <div className="flex items-center gap-1 text-sm text-[var(--neon-cyan)]">
                  <TrendingUp className="size-4" />
                  +24.6%
                </div>
              </div>
              <div className="grid grid-cols-12 gap-1 h-40 items-end">
                {Array.from({ length: 24 }).map((_, i) => {
                  const h = 20 + Math.sin(i * 0.6) * 30 + Math.random() * 30;
                  return (
                    <div
                      key={i}
                      className="rounded-t-sm bg-gradient-to-t from-[var(--neon-cyan)]/30 to-[var(--neon-magenta)]/60"
                      style={{ height: `${h + 30}%` }}
                    />
                  );
                })}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { icon: Activity, label: "Active users", value: "12.4k" },
                  { icon: Zap, label: "Conversion", value: "8.2%" },
                  { icon: TrendingUp, label: "ARR", value: "$3.2M" },
                ].map((s, i) => (
                  <div key={i} className="rounded-lg border border-border bg-card/50 p-3">
                    <s.icon className="size-4 text-[var(--neon-cyan)] mb-2" />
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="text-lg font-display font-semibold">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-[var(--neon-cyan)]/20 to-[var(--neon-magenta)]/20 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
