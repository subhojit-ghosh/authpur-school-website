# Authpur National Model Higher Secondary School — Website

Marketing website for **Authpur National Model Higher Secondary School**, Ghosh Para Road, Authpur, Shyamnagar, West Bengal 743128.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4** and **shadcn/ui**.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build
```

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Fonts, metadata, header + footer shell
│   ├── page.tsx            # Home page — composes all sections
│   └── globals.css         # Design tokens (navy + gold palette), utilities
├── components/
│   ├── crest.tsx           # SVG school crest
│   ├── site-header.tsx     # Sticky nav + announcement bar + mobile menu
│   ├── site-footer.tsx     # Footer with links & contact
│   ├── sections/           # Home page sections (hero, about, academics, …)
│   └── ui/                 # shadcn/ui primitives
└── lib/
    ├── site.ts             # Single source of truth for all school content
    └── utils.ts            # cn() helper
```

## Editing content

Almost all copy — school details, stats, programmes, features, notices,
events, testimonials — lives in [`src/lib/site.ts`](src/lib/site.ts). Update
values there and every section reflects the change.

## Design system

- **Palette:** scholarly navy (`--brand`) + warm gold (`--gold`) on a soft
  ivory background. Defined as CSS variables in `globals.css`.
- **Type:** _Fraunces_ (serif) for headings, _Inter_ for body/UI.
- **Theming:** shadcn/ui tokens are mapped to the brand palette; a dark theme
  is also defined but not toggled by default.

## Notes / next steps

- The gallery and hero use styled placeholders — drop in real campus
  photographs (e.g. via `next/image`) when available.
- The enquiry form opens the visitor's email client with details pre-filled.
  Wire it to a backend / form service for direct submissions.
- Interior pages (About, Academics, Admissions, Contact) can be added under
  `src/app/<route>/page.tsx`; the header/footer already wrap every route.
