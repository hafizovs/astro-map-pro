# 06 — UI Panels (Telescope Dashboard)

Документ обязателен. Все панели — standalone components, Signals, новый control flow.

---

## 6.1 Файлы компонентов

| Path | Selector | Role |
|------|----------|------|
| `components/telescope-dashboard/*` | `amp-telescope-dashboard` | Shell: toolbar + canvas + sidebar + time player (**RENAME-LOCKED**) |
| `components/sky-canvas/*` | `amp-sky-canvas` | Небосвод |
| `components/observer-panel/*` | `amp-observer-panel` | Широта/долгота, LST, layers, presets |
| `components/time-player/*` | `amp-time-player` | Play/pause, speed |
| `components/star-detail-card/*` | `amp-star-detail-card` | Карточка выбранной звезды |
| `components/toolbar/*` | `amp-toolbar` | Brand, theme, lang, sidebar toggle |

---

## 6.2 Composition (telescope-dashboard)

```html
<div class="amp-shell" [attr.data-theme]="ui.theme()">
  <amp-toolbar />

  <div class="amp-main">
    <amp-sky-canvas class="amp-sky" />

    @if (ui.sidebarOpen()) {
      <aside class="amp-sidebar">
        <amp-observer-panel />
        @if (selection.selectedStarId(); as starId) {
          <amp-star-detail-card [starId]="starId" />
        }
      </aside>
    }
  </div>

  <amp-time-player />
</div>
```

Используй `@if` / `@for` / `@let` — **не** `*ngIf`.

Layout:
- Desktop: CSS grid/flex; sidebar 340px.
- `< 900px`: sidebar overlay; кнопка в toolbar открывает/закрывает.

---

## 6.3 Toolbar

Обязательные элементы:
- Brand wordmark: **AstroMap Pro** (hero-level сигнал бренда в chrome, не только favicon).
- Theme toggle (dark/light).
- Locale toggle (RU/EN).
- Sidebar toggle (mobile/desktop).
- Опционально: иконка/кнопки быстрых location presets (дублируют observer panel).

Все подписи через `I18nService.t(...)`.

---

## 6.4 Observer Panel

### Controls
1. **Latitude** slider + numeric readout: `[-90, 90]`, step 0.1°.
2. **Longitude** slider + readout: `[-180, 180]`, step 0.1°.
3. **Live LST** readout: `HH:MM:SS` sidereal (computed from TimeStore + ObserverStore через AstroMathService).
4. **Location presets** buttons: Moscow, Equator, North Pole, South Pole.
5. **Layer toggles**:
   - Show coordinate grid
   - Show constellation lines
   - Show star labels

### Behaviour
- Движение lat должно немедленно менять небо (через stores → следующий rAF кадр).
- На +90° пользователь **видит** эффект J2 (Polaris near zenith).
- Preset применяет lat/lon атомарно.

---

## 6.5 Time Player

Bottom bar:
- Play / Pause button (Space).
- Speed presets: Hour/sec (default), Day/sec, Week/sec + range slider.
- UTC (или local display) datetime readout, обновляемый от `utcMs`.
- Опционально: кнопка «Now» → `utcMs = Date.now()`.

**Канон скорости:** `speedSimHoursPerRealSec` — см. `time.constants.ts`.

При `playing = false` положение звёзд заморожено (LST фиксирован на текущем utcMs).

---

## 6.6 Star Detail Card

Показывать только при `selectedStarId != null`.

Поля (обязательны):
| Field | Source |
|-------|--------|
| Name | i18n `nameKey` + latin fallback |
| Bayer | `star.bayer` |
| Constellation | constellation name via id |
| Distance | `distanceLy` + unit |
| RA | format hours/minutes from `raHours` |
| Dec | format ±degrees |
| Altitude (live) | recomputed each time tick |
| Azimuth (live) | recomputed |
| Magnitude | number |
| Spectral class | string |
| Color swatch | spectral color |

Кнопка Close → `selectStar(null)`.

Карточка — единственное место, где «card» UI оправдан (interaction container).

---

## 6.7 i18n keys (минимум групп)

Группы ключей (полный список в 07):
- `app.*` (title, subtitle)
- `toolbar.*`
- `observer.*` (lat, lon, lst, presets, layers)
- `time.*`
- `star.*` (card fields)
- `constellation.*` (имена)
- `starName.*` (имена звёзд)

---

## 6.8 Responsive & a11y

- Focus rings на кнопках/слайдерах.
- `aria-label` для play, theme, lang, close card.
- Sliders имеют `aria-valuemin/max/now`.
- Не блокировать скролл страницы колесом над canvas (preventDefault на wheel только на canvas).

---

## 6.9 Запреты

- Считать alt-az в template или в panel component вручную (только через service/computed).
- Lorem ipsum.
- Карточки-статы в первом viewport вне star detail.
- Router-outlet / отдельные страницы.

---

## 6.10 Критерий готовности документа 06

Dashboard собирает все панели; observer/time/card/layers работают на Signals; UI соответствует Midnight Space Dark.
