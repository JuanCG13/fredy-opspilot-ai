---
name: OpsPilot AI Design System
mode: dark
primary: "#38BDF8"
secondary: "#22C55E"
tertiary: "#A78BFA"
neutral: "#0F172A"
fonts:
  headline: Space Grotesk
  body: Inter
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
radii:
  card: 22px
  control: 14px
---

# OpsPilot AI Design Direction

A serious dark enterprise cockpit for AI workflow automation. It should feel like a credible internal operations console that a SaaS team could use to inspect runs, source citations, approvals, and logs.

## Principles

- Dense but calm admin interface.
- 8px grid, 24px card padding, 32px desktop gutters.
- Sidebar + top status strip.
- First-class auditability: run logs, retrieved context, token/cost estimate.
- Human approval actions are visually prominent.
- Avoid marketing-page whitespace and fake production claims.

## Components

- Sidebar navigation
- KPI card
- Workflow template card
- Run log table
- Retrieved source card
- Approval queue card
- Document library card
- Settings panel

## Responsive

- Desktop: sidebar + content grid.
- Tablet/mobile: collapse sidebar, stack panels, preserve action visibility.
