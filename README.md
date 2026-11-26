# Kalandria National Statistics

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)

The official statistics site of the **Republic of Kalandria** (fictional country, capital Port Meridia, currency the kaldar) — built for the make.fun bounty *Make the best national statistics site*.

It runs in a browser from static files with **no network requests**, on desktop and on a phone.

## Pages

- **Overview** — six headline indicators, GDP and population charts 2019–2024, latest releases.
- **Economy** — switchable tabs for GDP, unemployment, inflation and trade; a sector donut; the full 2019–2024 table with a working **Download CSV** button.
- **Population** — age structure, life expectancy, the arithmetic of population change, and a province table with **search and sortable columns**.
- **Regions & environment** — population by province, a province explorer with twelve indicators per province, and six national environment indicators.

Every chart is hand-built inline SVG; every figure is consistent across pages (province populations sum to the national total of 4,286,000; age groups and sectors each sum to 100%).

## Run it

```sh
node serve.ts            # serves app/ at http://localhost:8080
```

Open `http://localhost:8080`, or open `app/index.html` directly — no build step.

## Layout

- `main.ts` — entry point: copies `app/` and `screenshots/` to the output directory and writes `dossier.json` (Node 22, standard library only).
- `vendor/makefun-frontend.ts` — the kit's library, copied unchanged.
- `app/` — the site: `index.html`, `style.css`, `data.js`, `charts.js`, `views.js`, `main.js`.
- `screenshots/` — real renders of the site's own code, including one at phone size.

## Data

All figures are invented for the fictional Republic of Kalandria. Sources and method notes are stated in the site footer.
