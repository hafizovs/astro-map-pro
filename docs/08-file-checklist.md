# 08 — File Checklist

Генератор **обязан** создать каждый файл из списка. Отмечай мысленно ☑. Пропуск файла = провал DoD.

Рядом с путём — краткое содержание (1–2 предложения). Код внутри файла — **полный**, без сокращений.

Файлы с пометкой **LOCK** — rename-locked из брифа; путь не менять.

---

## 8.1 Project root / Angular scaffold

| # | Path | Content |
|---|------|---------|
| 1 | `package.json` | Имя `astro-map-pro`, scripts start/build/test |
| 2 | `angular.json` | project config, styles `src/styles.scss` |
| 3 | `tsconfig.json` | base TS config |
| 4 | `tsconfig.app.json` | app TS config |
| 5 | `tsconfig.spec.json` | spec TS config |
| 6 | `src/index.html` | title AstroMap Pro, root element |
| 7 | `src/main.ts` | bootstrapApplication |
| 8 | `src/styles.scss` | CSS variables Midnight Space Dark/light, reset, fonts, full viewport |
| 9 | `README.md` | install, start, test, hotkeys, math summary |

Если выбран Tailwind — также `tailwind.config.js` / postcss config (полный, без TODO).

---

## 8.2 App shell

| # | Path | Content |
|---|------|---------|
| 10 | `src/app/app.config.ts` | zoneless providers |
| 11 | `src/app/app.component.ts` | mounts telescope-dashboard; theme attr |
| 12 | `src/app/app.component.html` | `<amp-telescope-dashboard />` |
| 13 | `src/app/app.component.scss` | full-viewport host |

---

## 8.3 Models (LOCK)

| # | Path | Content |
|---|------|---------|
| 14 | `src/app/models/astronomy.types.ts` | **LOCK** — Star, Constellation, Observer, coords, camera, layers, ProjectedStar, SelectedStarInfo |

---

## 8.4 Core constants & models

| # | Path | Content |
|---|------|---------|
| 15 | `src/app/core/constants/astronomy.constants.ts` | DEG/HOURS/JD epoch/MS_PER_DAY |
| 16 | `src/app/core/constants/time.constants.ts` | speed presets, min/max |
| 17 | `src/app/core/constants/render.constants.ts` | DPR, zoom, pan, mag→radius, hit slop, grid |
| 18 | `src/app/core/constants/location-presets.constants.ts` | Moscow/Equator/N/S pole |
| 19 | `src/app/core/models/theme.model.ts` | ThemeId |
| 20 | `src/app/core/models/locale.model.ts` | LocaleId |

---

## 8.5 Domain astronomy

| # | Path | Content |
|---|------|---------|
| 21 | `src/app/domain/astronomy/angle.util.ts` | deg/rad, normalize, clamp |
| 22 | `src/app/domain/astronomy/julian.util.ts` | utcMs → JD / centuries |
| 23 | `src/app/domain/astronomy/sidereal.util.ts` | GMST, LST |
| 24 | `src/app/domain/astronomy/coordinates.util.ts` | equatorial → horizontal |
| 25 | `src/app/domain/astronomy/stereographic.util.ts` | altaz → canvas |
| 26 | `src/app/domain/astronomy/star-draw.util.ts` | mag radius/alpha, spectral color |
| 27 | `src/app/domain/astronomy/hit-test.util.ts` | star/constellation picking |
| 28 | `src/app/domain/astronomy/julian.util.spec.ts` | JD oracle tests |
| 29 | `src/app/domain/astronomy/sidereal.util.spec.ts` | GMST/LST tests |
| 30 | `src/app/domain/astronomy/coordinates.util.spec.ts` | Polaris/Crux/transit oracles |
| 31 | `src/app/domain/astronomy/stereographic.util.spec.ts` | zenith/horizon mapping tests |

---

## 8.6 Domain catalog

| # | Path | Content |
|---|------|---------|
| 32 | `src/app/domain/catalog/stars.data.ts` | полный массив STARS из Appendix A (≥50) |
| 33 | `src/app/domain/catalog/constellations.data.ts` | CONSTELLATIONS + edges |
| 34 | `src/app/domain/catalog/star-catalog.ts` | maps, lookups, edge validation |

---

## 8.7 State stores

| # | Path | Content |
|---|------|---------|
| 35 | `src/app/state/observer.store.ts` | lat/lon/presets |
| 36 | `src/app/state/time.store.ts` | utcMs/playing/speed/tick |
| 37 | `src/app/state/camera.store.ts` | azimuth/zoom/pan |
| 38 | `src/app/state/sky-ui.store.ts` | layers/theme/locale/sidebar |
| 39 | `src/app/state/selection.store.ts` | selected star / hovered constellation |

---

## 8.8 Services (LOCK)

| # | Path | Content |
|---|------|---------|
| 40 | `src/app/services/star-catalog.service.ts` | **LOCK** — expose catalog |
| 41 | `src/app/services/astro-math.service.ts` | **LOCK** — math façade |
| 42 | `src/app/services/hotkeys.service.ts` | keyboard bindings |
| 43 | `src/app/services/i18n.service.ts` | t(key), locale signal |

---

## 8.9 Components

| # | Path | Content |
|---|------|---------|
| 44 | `src/app/components/telescope-dashboard/telescope-dashboard.component.ts` | **LOCK** shell |
| 45 | `src/app/components/telescope-dashboard/telescope-dashboard.component.html` | composition |
| 46 | `src/app/components/telescope-dashboard/telescope-dashboard.component.scss` | layout grid/responsive |
| 47 | `src/app/components/sky-canvas/sky-canvas.component.ts` | **LOCK** rAF host |
| 48 | `src/app/components/sky-canvas/sky-canvas.component.html` | canvas element |
| 49 | `src/app/components/sky-canvas/sky-canvas.component.scss` | full area |
| 50 | `src/app/components/sky-canvas/sky-renderer.ts` | draw pipeline |
| 51 | `src/app/components/sky-canvas/sky-pointer.controller.ts` | pan/zoom/hit |
| 52 | `src/app/components/observer-panel/observer-panel.component.ts` | lat/lon/layers/presets |
| 53 | `src/app/components/observer-panel/observer-panel.component.html` | controls |
| 54 | `src/app/components/observer-panel/observer-panel.component.scss` | panel styles |
| 55 | `src/app/components/time-player/time-player.component.ts` | play/speed |
| 56 | `src/app/components/time-player/time-player.component.html` | bottom bar |
| 57 | `src/app/components/time-player/time-player.component.scss` | styles |
| 58 | `src/app/components/star-detail-card/star-detail-card.component.ts` | selected star card |
| 59 | `src/app/components/star-detail-card/star-detail-card.component.html` | fields |
| 60 | `src/app/components/star-detail-card/star-detail-card.component.scss` | card styles |
| 61 | `src/app/components/toolbar/toolbar.component.ts` | brand/theme/lang |
| 62 | `src/app/components/toolbar/toolbar.component.html` | toolbar UI |
| 63 | `src/app/components/toolbar/toolbar.component.scss` | toolbar styles |

---

## 8.10 i18n

| # | Path | Content |
|---|------|---------|
| 64 | `src/app/i18n/locale.type.ts` | LocaleId re-export / type |
| 65 | `src/app/i18n/i18n.keys.ts` | key union or const map |
| 66 | `src/app/i18n/dictionaries/ru.ts` | полный RU словарь |
| 67 | `src/app/i18n/dictionaries/en.ts` | полный EN словарь |

---

## 8.11 Итого

**Итого: 67 файлов** (без учёта автогенерируемых CLI вроде `public/favicon.ico`, если CLI создаёт — оставить).

Если CLI создаёт дополнительные boilerplate файлы — допустимо сохранить. Не удалять rename-locked пути.

Пропуск любого файла из §8.1–8.10 = провал DoD.
