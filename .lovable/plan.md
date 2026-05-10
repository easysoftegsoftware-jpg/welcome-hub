## Landing Page: "Lumen" — AI-Powered Analytics SaaS

A bold, dark-futuristic landing page for a fictional SaaS analytics product. We can rename/rebrand once you see it.

### Aesthetic direction
- Dark theme with neon cyan + magenta accents over near-black background
- Editorial display typography (Space Grotesk for headings, Inter for body)
- Subtle grid backgrounds, glowing gradient orbs, layered glass cards
- Smooth scroll-triggered animations via framer-motion

### Sections (single landing route `/`)
1. **Sticky nav** — logo, links (Features, Pricing, FAQ), CTA button
2. **Hero** — oversized headline, subhead, dual CTAs, animated dashboard mockup
3. **Logo cloud** — "Trusted by teams at..." (placeholder brand wordmarks)
4. **Features grid** — 6 feature cards with icons (lucide-react), glow on hover
5. **How it works** — 3-step process with numbered cards
6. **Testimonials** — 3 quote cards with avatars
7. **Pricing** — 3 tiers (Starter / Pro / Enterprise), Pro highlighted
8. **FAQ** — accordion with 5–6 questions
9. **CTA banner** — final conversion push
10. **Footer** — columns of links, social icons, copyright

### Technical plan
- Update `src/styles.css` design tokens: dark-first palette, neon accents, gradient and glow tokens, custom font imports
- Replace `src/routes/index.tsx` placeholder with real landing content; set proper `head()` SEO (title, description, og tags)
- Create components in `src/components/landing/`:
  - `Navbar.tsx`, `Hero.tsx`, `LogoCloud.tsx`, `Features.tsx`, `HowItWorks.tsx`, `Testimonials.tsx`, `Pricing.tsx`, `FAQ.tsx`, `CTA.tsx`, `Footer.tsx`
- Use existing shadcn primitives (`button`, `card`, `accordion`, `badge`)
- Install `framer-motion` for entrance animations
- Apply dark mode by default (add `dark` class to html in `__root.tsx`)
- Fully responsive (mobile-first); single H1 in hero; semantic HTML

No backend needed for v1 — all content is static. Buttons link to `#` placeholders ready for wiring later.