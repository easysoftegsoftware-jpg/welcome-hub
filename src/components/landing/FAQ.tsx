import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How is Lumen different from a typical BI tool?", a: "Most BI tools wait for you to ask the right question. Lumen watches your data and surfaces what changed, why, and what to do — in plain language." },
  { q: "Where does my data live?", a: "Your warehouse stays your warehouse. Lumen queries it directly with read-only credentials, or ingests events to our SOC 2-compliant infrastructure if you prefer." },
  { q: "Can I try before paying?", a: "Yes. The Pro plan includes a 14-day free trial with no credit card. The Starter tier is free forever." },
  { q: "Do you support SSO and SAML?", a: "SSO via Google and Microsoft is included on all plans. SAML, SCIM, and custom RBAC ship with Enterprise." },
  { q: "What integrations are supported?", a: "200+ out of the box including Postgres, Snowflake, BigQuery, Stripe, Segment, HubSpot, and Salesforce. Anything missing? Use our SDK or webhooks." },
  { q: "Can I self-host Lumen?", a: "On the Enterprise plan, yes. We also offer single-tenant deployments in your VPC." },
];

export function FAQ() {
  return (
    <section id="faq" className="py-32 border-t border-border">
      <div className="container mx-auto max-w-3xl px-6">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-widest text-[var(--neon-magenta)] mb-4">FAQ</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold">Questions, answered.</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-display text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
