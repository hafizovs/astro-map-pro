## Live demo

https://hafizovs.github.io/astro-map-pro/

# AstroMap Pro

Interactive star map and constellation chart — an educational digital planetarium on Angular 22+ with Canvas 2D and stereographic projection.

## About

AstroMap Pro is an educational digital planetarium: an interactive map of the night sky and constellations on Angular 22+ with Canvas 2D and stereographic projection. Time and place run through Julian Date, GMST, and local sidereal time, then from equatorial coordinates to altitude and azimuth. A catalog of 72 bright or key stars (J2000) and constellation lines is drawn on a circular dome, zenith at the center and the horizon on the rim.

## Capabilities

- Pipeline: UTC → Julian Date → GMST → LST (using the observer’s longitude)
- Equatorial (RA, Dec) → horizontal (azimuth, altitude) via the hour angle
- Stereographic projection of the visible hemisphere (orthographic is not used)
- 72 brightest / key stars (J2000) and constellation lines (UMa, Ori, Cas, Cyg, Sco, Cru, CMa, and others)
- Time player, coordinate grid, constellation lines, star labels, and location presets
- Angular 22+ standalone components, Signals, zoneless change detection, OnPush, prefix `amp`
- RU/EN signal dictionaries

## Functionality

- Play or pause with Space, speed time up with `=` / `+`, and slow it with `-`
- Toggle the grid (`G`), constellation lines (`C`), and star labels (`L`)
- Jump to Moscow, the Equator, the North Pole, or the South Pole with `1`–`4`
- Select a star, then press Esc to clear the selection or close the sidebar
- Switch theme (`T`) and locale (`I`)

## Requirements

- Node.js ≥ 22
- npm ≥ 10

## Install and run

```bash
npm install
npm start
npm test
npm run build
```

The app opens at `http://localhost:4200/`.

## Tests

Unit tests cover JD, GMST/LST, equatorial → horizontal coordinates, and stereographic projection (including the Polaris-at-the-North-Pole oracle).

## Math (summary)

1. **UTC → Julian Date → GMST → LST** (using the observer’s longitude).
2. **Equatorial (RA, Dec) → horizontal (az, alt)** via the hour angle.
3. **Stereographic projection** of the visible hemisphere onto a circular sky dome (zenith at the center, horizon on the rim). Orthographic is not used.

Catalog: **72** brightest / key stars (J2000) and constellation lines (UMa, Ori, Cas, Cyg, Sco, Cru, CMa, and others).

## Hotkeys

| Key | Action |
|-----|--------|
| Space | Play / Pause |
| `=` / `+` | Speed up time |
| `-` | Slow down time |
| `G` | Grid |
| `C` | Constellation lines |
| `L` | Star labels |
| `1`…`4` | Moscow / Equator / N. pole / S. pole |
| `T` | Theme |
| `I` | RU ↔ EN |
| Esc | Clear star selection / close sidebar |

## Stack

- Angular **22+**, standalone components, Signals, zoneless CD, OnPush
- Prefix: `amp`
- HTML5 Canvas 2D only
- i18n: RU/EN signal dictionaries

## Structure

- `src/app/core` — shell (telescope dashboard, toolbar, time player), i18n, and hotkeys
- `src/app/features/sky` — sky dome, catalog, astronomy calculations, and sky state
- `src/app/features/observer` — observer panel and star card
- `src/app/domain` — coordinates, time, and catalog data
