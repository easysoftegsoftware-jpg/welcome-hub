import { Sparkles, Twitter, Github, Linkedin } from "lucide-react";

const cols = [
  { title: "Product", links: ["Features", "Pricing", "Integrations", "Changelog", "Roadmap"] },
  { title: "Company", links: ["About", "Customers", "Careers", "Press", "Contact"] },
  { title: "Resources", links: ["Docs", "Blog", "Guides", "API", "Status"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security", "DPA", "Cookies"] },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-6 gap-10">
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2 font-display font-semibold text-lg">
              <span className="size-8 rounded-lg bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-magenta)] flex items-center justify-center">
                <Sparkles className="size-4 text-background" />
              </span>
              Lumen
            </a>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              The AI-powered analytics command center for modern teams.
            </p>
            <div className="mt-6 flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="size-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-sm font-semibold mb-4">{c.title}</div>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Lumen Analytics, Inc. All rights reserved.</div>
          <div>Made with care, shipped with conviction.</div>
        </div>
      </div>
    </footer>
  );
}
