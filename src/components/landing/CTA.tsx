import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="relative rounded-3xl border border-border bg-card overflow-hidden p-12 md:p-20 text-center">
          <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 size-[500px] rounded-full bg-[var(--neon-cyan)]/20 blur-[120px]" />
          <div className="relative">
            <h2 className="font-display text-4xl md:text-6xl font-semibold leading-[1.05] max-w-3xl mx-auto">
              Stop guessing.
              <br />
              <span className="text-gradient">Start knowing.</span>
            </h2>
            <p className="mt-6 text-muted-foreground max-w-lg mx-auto">
              Join thousands of teams making faster, sharper decisions with Lumen.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] text-background font-medium hover:opacity-90 glow-cyan">
                Start free trial
                <ArrowRight className="ml-1 size-4" />
              </Button>
              <Button size="lg" variant="outline" className="bg-card/50 backdrop-blur">
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
