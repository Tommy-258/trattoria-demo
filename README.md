# Trattoria Bella Napoli

A one-page website for **Trattoria Bella Napoli**, a fictional family-run Neapolitan restaurant in Cobble Hill, Brooklyn.
This is a portfolio demo. The restaurant, address, phone number and reviews are placeholders.

## Tech stack

- **Next.js 16** (App Router) with **static export** (`output: "export"`)
- **React 19** and **TypeScript** (strict mode)
- **Tailwind CSS 4** (CSS-first config in `src/app/globals.css`)
- **ESLint** with `eslint-config-next` (Core Web Vitals + TypeScript rules)
- No UI libraries, no image assets in the page, and no runtime dependencies beyond Next and React

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local   # then set NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
```

| Script              | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Start the dev server                                 |
| `npm run build`     | Build the static site into `out/`                    |
| `npm start`         | Serve `out/` locally to preview the production build |
| `npm run lint`      | Run ESLint                                           |
| `npm run typecheck` | Run the TypeScript compiler without emitting         |
| `npm run images:hero -- <photo>` | Regenerate the responsive hero images from a source photo |

## Environment variables

| Name                   | Example                                     | Used for                                                       |
| ---------------------- | ------------------------------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `https://trattoria-bella-napoli.vercel.app` | Canonical URL, Open Graph, schema.org data, robots and sitemap |

If it isn't set, the site falls back to `http://localhost:3000`. Always set it for production builds.

## Deploying to Vercel

1. Import the repository in Vercel. The framework preset is detected as Next.js.
2. Add `NEXT_PUBLIC_SITE_URL` under **Settings → Environment Variables**.
3. Deploy. Because the site is a static export, the `out/` folder can also be hosted on any static host
   (Netlify, Cloudflare Pages, S3, GitHub Pages).

## Project structure

```
src/
  app/
    layout.tsx         Fonts, metadata (SEO + Open Graph), JSON-LD
    page.tsx           Puts the sections together
    globals.css        Tailwind theme tokens, components and CSS patterns
    robots.ts          → /robots.txt
    sitemap.ts         → /sitemap.xml
    icon.svg           Favicon
  components/          One file per section plus small client components
  config/
    restaurant.ts      ← every restaurant detail lives here
  generated/
    hero-image.json    Widths + blur placeholder written by the hero image script
  lib/
    image-loader.ts    next/image loader for pre-generated responsive images
scripts/
  optimize-hero.mjs    Builds the hero AVIF/WebP crops with sharp
public/
  images/              Photos (WebP/AVIF)
  og-image.png         1200×630 social sharing image
```

### Editing restaurant details

Everything specific to the restaurant is in [`src/config/restaurant.ts`](src/config/restaurant.ts):
name, tagline, address, coordinates, phone, email, social links, opening hours, reservation rules,
the full menu (with vegetarian and spicy flags) and the example reviews. The page, the reservation form's time slots,
the page metadata and the schema.org `Restaurant` data are all generated from this file, so you never have to
change a detail in more than one place.

## Design choices

**Light and warm, not "tech".** The palette is built around a cream paper background (`#fbf6ee`), a deep tomato red
(`#a92f1d`) and an olive green (`#55652c`), with a warm near-black ink for text. These are the colors of a Neapolitan
table: San Marzano tomatoes, olive oil and basil, on linen. Every text/background pair meets WCAG AA contrast
(body text is above 7:1, and the accent colors are about 6:1 on cream).

**Type.** _Playfair Display_ is a high-contrast serif with a lovely italic, used for headings and prices to give a classic
menu-card feel. _Inter_ is used for body text and forms because it stays readable at small sizes. Both are self-hosted
through `next/font`, so there are no requests to Google Fonts at runtime and no layout shift.

**Photography where it counts.** The hero is a full-screen photo of a margherita coming out of a wood-fired oven,
under a warm, dark brown gradient (never pure black) that keeps the cream text above WCAG AA contrast even over the
brightest flames. The navbar sits transparent over the photo with light text and turns into the solid cream bar once
you scroll. The Our Story section has two more photos (the oven and a plate of spaghetti). The gingham tablecloth,
the paper texture and the map preview are still drawn with CSS gradients, so they weigh almost nothing.

**Responsive images in a static export.** Static export turns off Next's on-demand image optimizer, so the hero images
are prepared ahead of time: `scripts/optimize-hero.mjs` uses sharp to create a landscape crop (640–2560px) and a
portrait crop for phones (640–1280px), each in AVIF and WebP, plus a tiny blur placeholder. A custom `next/image`
loader (`src/lib/image-loader.ts`) maps the widths in `srcset` to those files, and the hero uses `getImageProps` with
`<picture>` for art direction. A phone downloads a ~36 KB AVIF portrait crop, while a 1440px desktop gets a ~63 KB
AVIF. The image loads eagerly with `fetchpriority="high"` and causes no layout shift.
The two Our Story photos are single WebP files cropped to their display size.

**Details.**

- A dotted "leader" line between dish name and price, like a printed menu.
- An Italian tricolore rule under the hero.
- Short Italian section labels (_Il menù_, _Prenota_) for flavor, with English headings so everything stays clear.

## Features and how they're built

- **Menu tabs.** Follows the WAI-ARIA tabs pattern: arrow keys, Home and End move between categories, and every
  dish stays in the HTML (inactive panels are only `hidden`) so search engines can read the full menu.
- **Click-to-load map.** The Google Maps iframe is only created after the visitor clicks "Load interactive map".
  Until then there are no third-party requests or cookies, and the page loads faster. A "Get directions" link
  works without loading the map.
- **Reservation form.** Client-side validation with clear messages: required fields, email format, 10-digit US phone,
  no past dates, no Mondays (closed), bookings up to 90 days ahead, and time slots generated from that day's opening
  hours. Errors are shown on blur and on submit, linked to their fields with `aria-describedby`, and focus moves
  to the first invalid field. On success the confirmation message receives focus.
  _The form is a demo and sends nothing._ To make it real, replace the timeout in `onSubmit` in
  `ReservationForm.tsx` with a call to a booking API or a form service such as Formspree.
- **Sticky mobile "Reserve" bar** with a call button. It appears once you scroll past the hero and hides while the
  reservation form is on screen, so it never covers the form it links to.
- **Hero motion.** The photo scrolls at about a third of the page speed (parallax), zooms in very slowly on load
  (Ken Burns, 22s, 8%), and on desktop with a real mouse drifts a few pixels against the cursor. It all runs on
  CSS transforms driven by a single `requestAnimationFrame` loop that only runs while the hero is on screen
  (`HeroMotion.tsx`), with no animation library. Touch devices get no mouse effect, and with
  `prefers-reduced-motion` the photo is completely static.
- **Motion elsewhere.** Smooth scrolling and fade-in sections on scroll (IntersectionObserver). All of it is turned
  off when `prefers-reduced-motion` is set, and content stays visible without JavaScript.
- **Accessibility.** Semantic landmarks and heading order, a "Skip to content" link, visible focus rings, 44px+ touch
  targets, labeled icon buttons, `inert` on the hidden mobile bar, and screen-reader text for prices, ratings and
  links that open in a new tab.
- **SEO.** Title, meta description, canonical URL, Open Graph and Twitter cards, schema.org `Restaurant` JSON-LD
  (address, coordinates, opening hours, cuisine, price range, menu link), `robots.txt` and `sitemap.xml`.
  All absolute URLs come from `NEXT_PUBLIC_SITE_URL`.

## Performance

The page is fully static HTML with a small amount of client-side JavaScript: the header menu, hero motion, menu tabs,
map, form, mobile bar and scroll reveal. A local Lighthouse run (mobile, simulated throttling) scored **100** for Accessibility,
Best Practices and SEO, and about **90–96** for Performance with zero layout shift.

## Photo credits

All photos are used under the [Unsplash License](https://unsplash.com/license) (free for commercial and
non-commercial use, no permission needed).

| File                                    | Photo                                                                                                                       | Photographer                                              |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `public/images/hero/*` (hero)          | [Pizza baking in wood-fired oven](https://unsplash.com/photos/pizza-baking-in-wood-fired-oven-vHRFraV4U00)                  | [Fabrizio Pullara](https://unsplash.com/@fabrizio_photopf) |
| `public/images/wood-fired-oven.webp`    | [A chef cooks pizza in a wood-fired oven](https://unsplash.com/photos/a-chef-cooks-pizza-in-a-wood-fired-oven-7TAG9wlv1uw) | [Brad](https://unsplash.com/@minimdesignco)               |
| `public/images/spaghetti-pomodoro.webp` | [A plate of spaghetti with tomato sauce and parsley](https://unsplash.com/photos/Htb3Neu9Tmg)                               | [Mandy Bourke](https://unsplash.com/@myshegotripped)      |

## Disclaimer

Trattoria Bella Napoli does not exist. All names, contact details, social links and reviews on the site are placeholders
for demonstration purposes.
