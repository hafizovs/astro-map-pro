# 03 — Data Model & Units

Все интерфейсы ниже реализуй **буквально**. Числовой каталог звёзд и линий — в [appendix-a-star-catalog.md](appendix-a-star-catalog.md); скопируй значения в `domain/catalog/*.data.ts` без округления сильнее, чем в таблице.

**Канон координат RA:** decimal hours (`raHours`), плюс helper `raHoursMinutesToDecimal(h, m, s?)` при желании для читаемости исходных таблиц. В runtime модели храни **decimal hours**.

---

## 3.1 Единицы и константы

Файл: `src/app/core/constants/astronomy.constants.ts`

```ts
/** Градусов в полном круге */
export const DEG_PER_CIRCLE = 360;

/** Часов в полном обороте RA / sidereal day mapping */
export const HOURS_PER_CIRCLE = 24;

/** Градусов на один час прямого восхождения */
export const DEG_PER_HOUR = 15;

/** Юлианская дата эпохи J2000.0 */
export const EPOCH_J2000_JD = 2451545.0;

/** Секунд в средних солнечных сутках */
export const SECONDS_PER_DAY = 86_400;

/** Миллисекунд в средних солнечных сутках */
export const MS_PER_DAY = 86_400_000;

/** Скорость света, km/s (для справки; расстояние в каталоге уже в ly) */
export const SPEED_OF_LIGHT_KM_S = 299_792.458;
```

Файл: `src/app/core/constants/time.constants.ts`

```ts
/** Скорость: симуляционные часы за 1 реальную секунду */
export const TIME_SPEED_PRESETS = {
  realtime: 1 / 3600, // 1 sim second ≈ 1 real second (очень медленно для неба)
  hourPerSec: 1,      // default: 1 sim hour / real sec
  dayPerSec: 24,      // 1 sim day / real sec
  weekPerSec: 24 * 7,
} as const;

export type TimeSpeedPresetId = keyof typeof TIME_SPEED_PRESETS;

export const TIME_SPEED_MIN = 1 / 3600;
export const TIME_SPEED_MAX = 24 * 30; // до ~1 месяца/сек
```

Файл: `src/app/core/constants/render.constants.ts` — числа из Appendix A §A.5 и документа 05.

Файл: `src/app/core/constants/location-presets.constants.ts` — из Appendix A §A.4.

---

## 3.2 Rename-locked типы

Файл: `src/app/models/astronomy.types.ts` (**RENAME-LOCKED**)

Реализуй **все** типы ниже в этом файле (можно реэкспортировать из `core/models`, но сам файл обязан существовать и экспортировать публичный API моделей астрономии):

```ts
/** Идентификатор звезды (kebab / snake стабильный ключ) */
export type StarId = string;

/** Идентификатор созвездия */
export type ConstellationId = string;

/** Спектральный класс (буква + опциональная цифра/подкласс строкой) */
export type SpectralClass = string; // e.g. "A1", "M2", "G2", "B8", "O5", "K5", "F5"

export interface EquatorialCoordinates {
  /** Right Ascension in decimal hours [0, 24) */
  raHours: number;
  /** Declination in degrees [-90, 90] */
  decDeg: number;
}

export interface HorizontalCoordinates {
  /** Azimuth in degrees: 0 = North, 90 = East, 180 = South, 270 = West (канон) */
  azimuthDeg: number;
  /** Altitude above horizon in degrees; 0 = horizon, 90 = zenith */
  altitudeDeg: number;
}

export interface ObserverLocation {
  /** Geographic latitude degrees [-90, 90] */
  latitudeDeg: number;
  /** Geographic longitude degrees [-180, 180]; East positive (канон) */
  longitudeDeg: number;
}

export interface ScreenPoint {
  x: number;
  y: number;
  /** false если ниже горизонта или вне купола */
  visible: boolean;
}

export interface Star {
  id: StarId;
  /** Display name key or literal RU/EN via i18n — канон: nameKey + fallback latin */
  nameKey: string;
  /** Bayer designation, e.g. "Alpha Orionis" */
  bayer: string;
  /** Latin / common english name, e.g. "Betelgeuse" */
  nameLatin: string;
  constellationId: ConstellationId;
  raHours: number;
  decDeg: number;
  /** Apparent visual magnitude (smaller = brighter) */
  magnitude: number;
  spectralClass: SpectralClass;
  /** Distance in light-years */
  distanceLy: number;
}

export interface ConstellationEdge {
  /** Star ids from catalog */
  fromStarId: StarId;
  toStarId: StarId;
}

export interface Constellation {
  id: ConstellationId;
  nameKey: string;
  nameLatin: string;
  /** IAU abbreviation if applicable, e.g. "UMa", "Ori" */
  abbr: string;
  edges: ConstellationEdge[];
  /** Primary star ids belonging to the figure (for hover hit) */
  starIds: StarId[];
}

export interface CameraState {
  /** Azimuth of view center / map rotation, degrees */
  centerAzimuthDeg: number;
  /** Zoom factor; 1 = default full dome */
  zoom: number;
}

export interface TimePlaybackState {
  utcMs: number;
  playing: boolean;
  /** Simulated hours advanced per 1 real second */
  speedSimHoursPerRealSec: number;
}

export interface LayerToggles {
  showGrid: boolean;
  showConstellationLines: boolean;
  showStarLabels: boolean;
}

export interface ProjectedStar {
  star: Star;
  horizontal: HorizontalCoordinates;
  screen: ScreenPoint;
  radiusPx: number;
  color: string;
  alpha: number;
}

export interface SelectedStarInfo {
  star: Star;
  horizontal: HorizontalCoordinates;
  /** LST hours at the moment of computation */
  lstHours: number;
}
```

Допустимо также положить дубликаты theme/locale в `core/models` — см. ниже.

---

## 3.3 Theme / Locale

`src/app/core/models/theme.model.ts`:

```ts
export type ThemeId = 'dark' | 'light';
```

`src/app/core/models/locale.model.ts`:

```ts
export type LocaleId = 'ru' | 'en';
```

---

## 3.4 Location presets

```ts
export type LocationPresetId =
  | 'moscow'
  | 'equator'
  | 'north-pole'
  | 'south-pole';

export interface LocationPreset {
  id: LocationPresetId;
  nameKey: string;
  latitudeDeg: number;
  longitudeDeg: number;
}
```

Значения — Appendix A §A.4.

---

## 3.5 Инварианты

1. **Видимость:** звезда рисуется только если `altitudeDeg >= 0` (на горизонте допустимо с alpha fade; ниже горизонта — `visible = false`).
2. **Magnitude → размер:** меньшая magnitude → больший радиус и выше alpha (формула в Appendix B / doc 05).
3. **Spectral class → цвет:** O/B голубые → A белые → F/G желтоватые → K оранжевые → M красные.
4. **RA нормализация:** `raHours` при расчётах приводить в `[0, 24)`.
5. **Azimuth нормализация:** в `[0, 360)`.
6. **Constellation edges** ссылаются только на существующие `Star.id`.
7. **Каталог:** не меньше **50** звёзд; целевой диапазон 50–70+ как в Appendix A (все строки таблицы обязательны).
8. **Полярная:** `polaris` имеет Dec близкое к +89.26° — не «рисовать руками в зенит», а получать из формул.

---

## 3.6 Каталог: файлы данных

| File | Content |
|------|---------|
| `domain/catalog/stars.data.ts` | Массив `STARS: Star[]` — все строки Appendix A §A.1 |
| `domain/catalog/constellations.data.ts` | Массив `CONSTELLATIONS: Constellation[]` — §A.2–A.3 |
| `domain/catalog/star-catalog.ts` | Сборка maps, валидация edges, экспорт helpers |

`StarCatalogService` читает только эти источники (не хардкодит второй параллельный каталог).

---

## 3.7 Критерий готовности документа 03

Все интерфейсы реализованы в `astronomy.types.ts`, константы на месте, каталог готов к заполнению из Appendix A, инварианты соблюдены в коде math/render.
