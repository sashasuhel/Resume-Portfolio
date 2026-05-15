# Sasha Fathima Suhel — World Map Portfolio

A one-page portfolio website themed as a futuristic game world map. The page scroll is a "journey" across multiple regions, each representing a resume topic. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step.

**Who it's for:** Recruiters, hiring managers, and technical stakeholders looking for a Data Analyst / IT Specialist with Power Platform, automation, and BI expertise.

---

## File Structure

```
/
├── index.html          Main page — all 6 regions in one file
├── styles.css          All styling, design tokens, responsive rules
├── script.js           Constellation canvas, scroll logic, minimap, counters, copy
├── assets/
│   └── avatar.png      Professional profile photo (circle crop in hero)
└── Sasha_Fathima_Resume.pdf   Original resume PDF
```

No `node_modules`, no build output, no package.json. Open `index.html` in any browser.

---

## Design Tokens

### Colors

| Token             | Value                          | Usage                            |
|--------------------|--------------------------------|----------------------------------|
| `--bg-deep`        | `#0a0e1a`                     | Body base (deep space)           |
| `--bg-primary`     | `#0d1120`                     | Default section background       |
| `--bg-region`      | `#0f1428`                     | Alternate section background     |
| `--bg-card`        | `rgba(15, 20, 42, 0.78)`     | Glass panel fill                 |
| `--bg-card-hover`  | `rgba(20, 28, 55, 0.92)`     | Glass panel on hover             |
| `--neon-cyan`      | `#00e5ff`                     | Primary accent, HUD tags, links  |
| `--neon-pink`      | `#ff4da6`                     | Secondary accent, warp button    |
| `--neon-gold`      | `#ffc400`                     | Company names, degree labels     |
| `--neon-green`     | `#00ff88`                     | Bullet markers, copy success     |
| `--neon-purple`    | `#b388ff`                     | Skill category headings          |
| `--text-primary`   | `#e8ecf8`                     | Headings, body text              |
| `--text-secondary` | `#8a95b8`                     | Descriptions, muted labels       |
| `--glass-border`   | `rgba(0, 229, 255, 0.1)`     | Panel borders                    |

### Scroll-driven background shifts

The body background interpolates between these colors as the user scrolls through regions:

| Region       | RGB                    | Mood              |
|--------------|------------------------|--------------------|
| Spawn        | `(10, 14, 26)`        | Deep space blue    |
| About        | `(8, 18, 32)`         | Teal hint          |
| Experience   | `(14, 12, 28)`        | Purple shift       |
| Skills       | `(8, 20, 22)`         | Green-teal         |
| Education    | `(16, 14, 24)`        | Warm purple        |
| Contact      | `(18, 10, 22)`        | Pink/magenta       |

### Typography

| Element        | Font                          | Size (clamp)                | Weight |
|----------------|-------------------------------|-----------------------------|--------|
| Body           | `Inter, system-ui`            | `17px` base                 | 400    |
| HUD tags       | `Space Grotesk`               | `0.68rem`                   | 600    |
| Region titles  | `Space Grotesko`              | `1.7rem – 2.6rem`           | 700    |
| Hero name      | `Space Grotesk`               | `2rem – 3.4rem`             | 700    |
| Stat numbers   | `Space Grotesk`               | `2.8rem`                    | 700    |

### Spacing & Radius

| Token           | Value    | Usage                         |
|-----------------|----------|-------------------------------|
| `--radius-xl`   | `28px`   | Cards, panels                 |
| `--radius-lg`   | `20px`   | Inner panels                  |
| `--radius-md`   | `14px`   | Toast, small panels           |
| `--radius-sm`   | `10px`   | Buttons                       |
| `--radius-full` | `9999px` | Pills, chips, tags, avatars   |

Section padding: `100px 48px` desktop, `80px 22px` mobile.

---

## Animation Guidelines

### Style

Cinematic, smooth, atmospheric. Everything should feel like a slow camera move or a subtle ambient effect — never bouncy, never playful, never jarring. Think film credits, not video game UI.

### What's animated

| Effect                     | Implementation                                   | Trigger              |
|----------------------------|--------------------------------------------------|----------------------|
| Constellation (stars + lines) | Canvas 2D, ~65 drifting nodes, connecting lines when < 140px apart, mouse-reactive | Always running       |
| Scroll-driven background  | `requestAnimationFrame`, lerps between 6 RGB stops based on scroll fraction | Scroll               |
| Section reveals            | `IntersectionObserver` adds `.revealed` — transitions `opacity`, `translateY(36px)`, `scale(0.97)`, `blur(6px)` → normal | Element enters viewport |
| Scene-enter flash          | `IntersectionObserver` adds `.scene-enter` — radial cyan glow `::after` pulses for 1.2s | Section enters viewport |
| Parallax terrain           | Each section has `data-depth` layers, `translateY` offset by `rect.top * depth` | Scroll (rAF)        |
| Stat counters              | `IntersectionObserver` triggers `requestAnimationFrame` counter from 0 → target with ease-out cubic | Element in viewport  |
| Avatar fade-out            | Opacity + scale transition tied to scroll position within hero section | Scroll               |
| Progress rail active state | `.active` class toggled on rail nodes based on which region is centered | Scroll (rAF)        |
| Minimap node highlights    | SVG map nodes get `.active` class synced with rail | Scroll (rAF)        |

### Cinematic overlay stack

| Layer          | z-index | Purpose                                         |
|----------------|---------|-------------------------------------------------|
| Vignette       | 9999    | Darkens viewport edges, camera lens feel       |
| Film grain     | 9998    | SVG `feTurbulence` + `steps(4)` jitter, 6% opacity |
| Light leak     | 9997    | Slow-drifting radial gradients, 14s breathing cycle |
| Scanlines      | 1       | Very subtle repeating horizontal lines         |

All overlays use `pointer-events: none`.

### Libraries used

**None.** Everything is vanilla CSS + JS. The only external dependency is Iconify (`code.iconify.design/3/3.1.0/iconify.min.js`) for vector icons.

### Reduced motion

All animations and overlays are disabled when `prefers-reduced-motion: reduce` is active. Reveals snap to visible, grain/leak/vignette are `display: none`, and `scroll-behavior` falls back to `auto`.

---

## Coding Conventions

### File organization

- **`index.html`** — All content in one file. Sections use `<section>` with `.region` class and `data-region` attribute. Quest cards store structured data in `data-quest` JSON attributes.
- **`styles.css`** — Single file, ordered: reset → tokens → overlays → HUD components → rail → warp/minimap → regions (hero → about → experience → skills → education → contact) → reveals → responsive → reduced-motion.
- **`script.js`** — Single IIFE, ordered: constellation → scroll handler (bg color + avatar + parallax + rail + minimap) → reveal observer → counter observer → quest card population → minimap logic → copy to clipboard → anchor scroll → initial state.

### Naming

- CSS classes: `kebab-case` (`.quest-card`, `.rail-node`, `.hud-panel`)
- CSS custom properties: `--kebab-case` (`--neon-cyan`, `--radius-xl`)
- JS variables: `camelCase` (`scrollY`, `currentRegion`, `prefersReduced`)
- Data attributes: `data-kebab-case` (`data-region`, `data-depth`, `data-quest`, `data-delay`)
- No IDs for styling — IDs only for JS hooks (`#starfield`, `#avatarContainer`, `#warpBtn`, `#minimapOverlay`, `#toast`)

### CSS rules

- Use custom properties from the token table — never hardcode colors or radii.
- All interactive elements get `transition: all var(--transition)` by default.
- Round everything: `border-radius: var(--radius-xl)` for cards, `var(--radius-full)` for pills and avatars.
- Glassmorphism: `backdrop-filter: blur(18px)` + `background: var(--bg-card)` + `border: 1px solid var(--glass-border)`.
- The gradient top-line accent (`::before` on `.hud-panel`) must stay — it's the signature HUD element.

### JS rules

- All scroll logic in a single `requestAnimationFrame` callback — no separate scroll listeners.
- Use `IntersectionObserver` for reveals and counters — never scroll-event-based checks.
- Quest card content is populated from `data-quest` JSON on page load — no hardcoded detail lists in JS.
- All DOM queries cached at the top of the IIFE — no querying inside loops or animation frames.
- `prefersReduced` check at the top — skip canvas, skip parallax, skip overlays, snap reveals.

### Adding a new section

1. Add a `<section>` in `index.html` with `class="region [zone-name]"` and `data-region="id"`.
2. Add a rail node in the `<nav class="progress-rail">`.
3. Add a minimap node in the SVG.
4. Add a background color stop in the `bgColors` array in `script.js`.
5. Add terrain patterns for the new zone in `styles.css`.
6. Wire the new region into the scroll rail detection (auto — uses `data-region`).

---

## Resume Data

> **This is the single source of truth for all resume content.** When adding or changing experience, skills, education, or contact info, edit this section first, then update `index.html` to match. Do not edit resume data directly in the HTML without updating this section.

### Personal Info

| Field       | Value                                                       |
|-------------|-------------------------------------------------------------|
| Name        | Sasha Fathima Suhel                                         |
| Title       | Data Analyst                                                |
| Location    | United Arab Emirates                                        |
| Email       | sashasuhel@gmail.com                                        |
| Phone       | +971545334746                                               |
| LinkedIn    | https://www.linkedin.com/in/sasha-suhel-9bb625174/         |
| Avatar      | `/assets/avatar.png`                                        |

### Profile Summary

Strong experience across the Microsoft 365 ecosystem and Power Platform, including Power Apps, Power Automate, Power BI, SharePoint, and Copilot, with a proven ability to design and deliver end‑to‑end digital solutions. Highly skilled in leveraging AI tools—such as Copilot and large language models like Claude—to accelerate development, improve solution design, generate optimized logic, and enhance documentation and decision-making workflows.

Built AI‑driven workflows and scalable automation solutions that integrate multiple data systems, significantly reduce manual effort, and deliver actionable insights through intelligent dashboards and reporting. Actively expanding focus on agentic workflows, intelligent optimization, and AI‑assisted development, with an emphasis on combining automation, analytics, and generative AI to create adaptive, future‑ready solutions that continuously improve business performance.

### Experience

#### 1. IT Specialist — Siemens LLC, Dubai
**Dates:** Apr 2024 — Present
- Designed/deployed 10+ automated workflows (Power Automate/Power Apps) cutting manual work up to 80%
- Built Power BI dashboards + data models for business metrics
- Developed SharePoint data pipelines integrated with enterprise systems
- Managed UAT for digital solutions
- Identified Copilot-enabled automation opportunities
- Supported Power Platform governance, version control, security
- **Tags:** Power Automate, Power Apps, Power BI, SharePoint, Copilot, UAT

#### 2. IT Digitalization & Communication Intern — Siemens LLC, Dubai
**Dates:** Aug 2023 — Aug 2024
- Automated reporting with Power Automate
- Built/maintained Power BI dashboards for operational visibility
- Supported workflow optimization + data pipeline improvements
- **Tags:** Power Automate, Power BI, Data Pipelines, Workflow Optimization

#### 3. Sales Engineer — Unique World Robotics, Dubai
**Dates:** Apr 2021 — May 2022
- 50+ sales visits, demos, training; tenders/proposals/quotations; pre/post sales support
- 3+ exhibitions and client meetings
- HubSpot CRM tracking 100% of sales activities
- **Tags:** Sales, HubSpot CRM, Client Relations, Proposals

#### 4. Operations Intern — WETEX, DEWA, Dubai
**Dates:** Oct 2021
- Feedback analysis, improvement suggestions
- Vendor coordination for AV/signage/promotional resources
- **Tags:** Operations, Vendor Coordination, Feedback Analysis

### Education

#### 1. Master's in Data Science — Heriot-Watt University, Dubai
**Dates:** Sept 2022 — Sept 2023

#### 2. Bachelor's in Information Technology — Amity University Dubai
**Dates:** Sept 2018 — Sept 2021

### Skills

| Category                  | Skills                                                        |
|---------------------------|---------------------------------------------------------------|
| Automation & Platforms    | Power Automate, Power Apps, SharePoint                        |
| Data & Analytics          | Power BI, SQL, Excel, Data Visualization                      |
| Programming & AI          | Python (Pandas, NumPy), NLP, Basic ML, Copilot                |
| Systems & Integration     | Microsoft 365 ecosystem, basic API integration, data pipelines|
| Business & Delivery       | Stakeholder management, UAT, Agile collaboration, cross-functional teams |

---

## Content Sync Rules

- **This file is always read first** before making any changes to the portfolio.
- When resume data changes: update the section above, then propagate to `index.html`.
- Experience bullet points and tags in `index.html` `data-quest` attributes must exactly match the entries above.
- Profile summary in the About section of `index.html` must match the text above.
- Skill categories and items in `index.html` must match the table above.
- Education entries in `index.html` must match the list above.
- Contact info (email, phone, LinkedIn URL) in `index.html` must match the personal info table above.
- **Never edit resume data in `index.html` without updating this file first.**
