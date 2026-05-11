# Sailing Plan B

Website for Ulrik & Karen's sailing journey on a 1984 Najad 343 from Norway to the Caribbean.

Live at [sailing-planb.com](https://www.sailing-planb.com)

## Tech stack

- **Next.js 16** — App Router, server components, ISR
- **Sanity v5** — CMS for blog posts, gallery albums, and site settings
- **Tailwind CSS** — Styling
- **Vercel** — Hosting and deployment

## Project structure

```
src/
  app/                  # Next.js App Router pages
    blog/               # Blog list and post pages
    gallery/            # Gallery overview and album pages
    about/              # About page
    api/revalidate/     # Webhook endpoint for on-demand revalidation
    sitemap.ts          # Auto-generated sitemap
  components/
    layout/             # Navbar and Footer
    ui/                 # ImageLightbox, ScrollGallery
  lib/
    sanity.ts           # Sanity client
    queries.ts          # GROQ queries
  sanity/
    schemaTypes/        # Content types: post, album, siteSettings, etc.
```

## Getting started

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000) for the site and [localhost:3000/studio](http://localhost:3000/studio) for Sanity Studio.

## Environment variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_REVALIDATE_SECRET=
```

## Content management

All content is managed through Sanity Studio at `/studio`:

- **Blog** — Write posts with title, date, location, body, and main image
- **Gallery** — Organize photos into albums and sub-albums
- **Site Settings** — Hero subtitle, current location, crew bios, boat info, route items, and home gallery images

## Deployment

Deployed on Vercel. Pushes to `main` trigger automatic deploys. Content updates in Sanity trigger instant revalidation via webhook at `/api/revalidate`.
