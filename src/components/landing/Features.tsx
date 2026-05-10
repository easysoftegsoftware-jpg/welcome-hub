import { motion } from "framer-motion";
import { Brain, BarChart3, Bell, Lock, Workflow, Globe } from "lucide-react";

const features = [
  { icon: Brain, title: "AI-native insights", desc: "Ask questions in plain English. Get charts, trends and anomalies in seconds." },
  { icon: BarChart3, title: "Unified dashboards", desc: "One canvas for product, revenue, and growth. No more 12 open tabs." },
  { icon: Bell, title: "Smart alerts", desc: "We surface what matters and stay quiet when nothing's wrong." },
  { icon: Workflow, title: "Automations", desc: "Trigger workflows from any metric — Slack, email, webhooks, code." },
  { icon: Lock, title: "Enterprise-grade", desc: "SOC 2, SSO, RBAC, audit logs. Encryption at rest and in transit." },
  { icon: Globe, title: "Connect anything", desc: "200+ integrations or query your warehouse directly. SQL still welcome." },
];

export function Features() {
  return (
    <section id="features" className="py-32 relative">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-16">
          <div className="text-xs uppercase tracking-widest text-[var(--neon-cyan)] mb-4">Features</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
            Everything you need.
            <br />
            <span className="text-muted-foreground">Nothing you don't.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative rounded-2xl border border-border bg-card p-8 hover:border-[var(--neon-cyan)]/50 transition-colors"
            >
              <div className="size-12 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-magenta)]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <f.icon className="size-5 text-[var(--neon-cyan)]" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
