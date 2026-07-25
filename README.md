# AstroMap Pro

Интерактивная карта звёздного неба и созвездий — образовательный цифровой планетарий на Angular 22+ с Canvas 2D и стереографической проекцией.

## Требования

- Node.js ≥ 22
- npm ≥ 10

## Установка и запуск

```bash
npm install
npm start
```

Приложение откроется на `http://localhost:4200/`.

## Тесты

```bash
npm test
```

Unit-тесты покрывают JD, GMST/LST, экваториальные → горизонтальные координаты и стереографическую проекцию (включая oracle Полярной на северном полюсе).

## Математика (кратко)

1. **UTC → Julian Date → GMST → LST** (с учётом долготы наблюдателя).
2. **Экваториальные (RA, Dec) → горизонтальные (az, alt)** через часовой угол.
3. **Stereographic projection** видимой полусферы на круглый небосвод (зенит в центре, горизонт на ободе). Orthographic не используется.

Каталог: **72** ярчайших / ключевых звёзд (J2000) и линии созвездий (UMa, Ori, Cas, Cyg, Sco, Cru, CMa и др.).

## Hotkeys

| Key | Action |
|-----|--------|
| Space | Play / Pause |
| `=` / `+` | Ускорить время |
| `-` | Замедлить время |
| `G` | Сетка |
| `C` | Линии созвездий |
| `L` | Подписи звёзд |
| `1`…`4` | Москва / Экватор / С. полюс / Ю. полюс |
| `T` | Тема |
| `I` | RU ↔ EN |
| Esc | Снять выбор звезды / закрыть sidebar |

## Стек

- Angular **22+**, standalone components, Signals, zoneless CD, OnPush
- Prefix: `amp`
- HTML5 Canvas 2D only
- i18n: signal-словари RU/EN

## Структура

См. `src/app/` — `domain/`, `state/`, `services/`, `components/`. Rename-locked пути брифа: `models/astronomy.types.ts`, `services/star-catalog.service.ts`, `services/astro-math.service.ts`, `components/sky-canvas/`, `components/telescope-dashboard/`.
