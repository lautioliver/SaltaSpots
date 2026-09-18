# SaltaSpots — Live Radar

A responsive, Spanish-language proof of concept for finding a place to work in Salta, Argentina. Built with Vite, React, TypeScript, Tailwind CSS, Lucide React, and Recharts.

## Run locally

Use Node 24.19.0 (recorded in `.nvmrc`) and npm 11.6.2. Older npm 10 releases can fail while resolving Vitest's optional peer dependencies.

```sh
nvm install
nvm use
npm install --global npm@11.6.2
npm install
npm run dev
```

Vite serves the app on port 5173. No credentials, database, environment variables, or backend are required.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

There are no pre-commit hooks configured in this repository.

## Included

- Three venues: Sorbo Specialty Coffee, Bixi Coffee, and STUDIO Coworking.
- Five-second simulated polling through `useLiveOccupancy`, with pause/resume and an animated occupancy indicator.
- Occupancy and free table counts derived from the same bounded table state. Green below 50%, amber from 50–80%, red above 80%.
- Wi-Fi, power outlet availability, and ambient noise information.
- Native modal dialogs with Café, Comida, and Info tabs, keyboard navigation, focus restoration, and Escape/backdrop dismissal.
- Hourly Recharts occupancy curves from 08:00–21:00. The current-hour marker uses `America/Argentina/Salta` and is hidden outside this range.
- Search, venue-type filters, a free-table filter, and favorites saved in local storage.
- Locally hosted images and fonts, responsive layouts, and reduced-motion support.

The chat request's three venues and SaltaSpots branding take precedence over the earlier attachment's four-venue SaltaWork draft.

## Demo data

**This is not live venue telemetry.** Occupancy is simulated and all menu items, prices, speeds, outlet counts, hours, and amenities are illustrative. Venue imagery is stock photography, not verified photography of the named businesses. The sponsor badge demonstrates a possible placement and does not claim an actual sponsorship. The app labels itself as a demo; details are available in “Cómo funciona” and each venue dialog.

The historical/forecast hourly curve is a fixture; only the current-hour point reflects the simulated occupancy. No bookings, ordering, payments, or accounts are implemented.

To integrate a real service, replace the polling state in `src/hooks/useLiveOccupancy.ts` and the venue fixtures in `src/data.ts`. The remaining UI consumes typed venue IDs and occupied-table counts.

## Assets

Stock photography from [Unsplash](https://unsplash.com/license), downloaded for this prototype:

- Sorbo illustration: `photo-1501339847302-ac426a4a7cbb`
- Bixi illustration: `photo-1445116572660-236099ec97a0`
- STUDIO illustration: `photo-1497366811353-6870744d04b2`

Manrope is licensed under the SIL Open Font License; the license is included in `public/fonts/OFL.txt`. Icons are provided by Lucide.
