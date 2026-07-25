# 04 — Astro Math Engine

Документ обязателен. Генератор реализует полный математический слой без упрощений «звезда просто едет вправо». Все формулы — в [appendix-b-formulas.md](appendix-b-formulas.md).

---

## 4.1 Файлы domain

| Path | Responsibility |
|------|----------------|
| `domain/astronomy/angle.util.ts` | `degToRad`, `radToDeg`, `normalizeDeg`, `normalizeHours`, `clamp` |
| `domain/astronomy/julian.util.ts` | UTC ms → Julian Date / Julian centuries |
| `domain/astronomy/sidereal.util.ts` | GMST, LST |
| `domain/astronomy/coordinates.util.ts` | Equatorial → Horizontal (az, alt) |
| `domain/astronomy/stereographic.util.ts` | Horizontal → unit stereographic → canvas XY |
| `domain/astronomy/star-draw.util.ts` | magnitude→radius/alpha, spectral→CSS color |
| `domain/astronomy/hit-test.util.ts` | nearest star / constellation under pointer |

Angular-обёртка: `services/astro-math.service.ts` (**RENAME-LOCKED**) — делегирует в domain, не дублирует формулы копипастой вторым вариантом.

---

## 4.2 Публичный API `AstroMathService`

```ts
@Injectable({ providedIn: 'root' })
export class AstroMathService {
  julianDate(utcMs: number): number;

  /** Greenwich Mean Sidereal Time in hours [0, 24) */
  gmstHours(utcMs: number): number;

  /** Local Sidereal Time in hours [0, 24) */
  lstHours(utcMs: number, longitudeDeg: number): number;

  equatorialToHorizontal(
    raHours: number,
    decDeg: number,
    lstHours: number,
    latitudeDeg: number,
  ): HorizontalCoordinates;

  /**
   * Stereographic projection of horizontal coords onto unit disk,
   * then map to canvas pixels. Respects camera centerAzimuth and zoom.
   */
  projectHorizontalToCanvas(
    horizontal: HorizontalCoordinates,
    camera: CameraState,
    canvasWidth: number,
    canvasHeight: number,
  ): ScreenPoint;

  projectStar(
    star: Star,
    observer: ObserverLocation,
    utcMs: number,
    camera: CameraState,
    canvasWidth: number,
    canvasHeight: number,
  ): ProjectedStar;

  projectAllStars(
    stars: readonly Star[],
    observer: ObserverLocation,
    utcMs: number,
    camera: CameraState,
    canvasWidth: number,
    canvasHeight: number,
  ): ProjectedStar[];

  magnitudeToRadiusPx(magnitude: number, zoom: number): number;
  magnitudeToAlpha(magnitude: number): number;
  spectralClassToColor(spectralClass: string): string;

  findStarAtPointer(
    projected: readonly ProjectedStar[],
    x: number,
    y: number,
    hitSlopPx?: number,
  ): Star | null;

  findConstellationAtPointer(
    projected: readonly ProjectedStar[],
    constellations: readonly Constellation[],
    x: number,
    y: number,
    hitSlopPx?: number,
  ): Constellation | null;
}
```

Сигнатуры можно слегка адаптировать под стиль проекта, но **поведение** обязательно.

---

## 4.3 Обязательные преобразования (pipeline)

Для каждой звезды на кадр:

```
utcMs + lon → LST
(RA, Dec, LST, lat) → (azimuth, altitude)
if altitude < 0 → invisible
(azimuth, altitude, camera, canvasSize) → stereographic (x, y)
(magnitude, spectralClass) → radiusPx, alpha, color
```

### 4.3.1 Julian Date
Из UTC milliseconds → JD (см. B.2). Не использовать приближение «дней от epoch наугад» без формулы.

### 4.3.2 GMST / LST
- GMST (hours) из JD по стандартной формуле (B.3).
- LST = GMST + longitudeDeg / 15; нормализовать в `[0, 24)`.

### 4.3.3 Equatorial → Horizontal
- Hour Angle `HA = LST − RA` (в часах) → градусы `HA * 15`.
- `sin(alt)`, `cos(alt)`, `sin(az)`, `cos(az)` — формулы B.4.
- **Канон азимута:** 0° = North, 90° = East (астрономический / navigation style). Если используешь atan2 вариант — согласуй квадранты и тесты.

### 4.3.4 Stereographic Projection (канон)
- Проектировать видимую полусферу (altitude ≥ 0) на круг.
- Зенит → центр круга; горизонт → окружность радиуса R.
- Учитывать `centerAzimuthDeg` как поворот карты: `az' = az − centerAzimuth`.
- `zoom` масштабирует радиус проекции (больший zoom → ближе к зениту крупнее / «приближение»).

Псевдокод — Appendix B §B.5. **Orthographic запрещён.**

---

## 4.4 Magnitude & spectral helpers

Минимум (точные коэффициенты — A.5 / B.6):

```ts
// radius grows as magnitude decreases
radiusPx = clamp(base * 10^(-0.2 * (mag - magRef)) * zoom, minR, maxR)
alpha = clamp(a0 - k * mag, minA, maxA)
```

Spectral letter (первый символ uppercased):

| Class | Color (approx) |
|-------|----------------|
| O | `#9bb0ff` |
| B | `#aabfff` |
| A | `#cad7ff` |
| F | `#f8f7ff` |
| G | `#fff4ea` |
| K | `#ffd2a1` |
| M | `#ffcc6f` |
| default | `#e8eefc` |

---

## 4.5 Hit-testing

- Звезда: минимальная дистанция pointer→screen ≤ `max(radiusPx, hitSlop)` среди `visible`.
- Созвездие: если hit по звезде с `constellationId`, вернуть это созвездие; **или** расстояние до ближайшего сегмента edge < threshold (канон: **оба** — сначала звезда, иначе сегмент).
- При hit созвездия `SelectionStore.setHoveredConstellation(id)`.

---

## 4.6 Запреты

- Запрещено двигать звёзды простым `x += speed * t` без LST.
- Запрещено хардкодить Polaris в центр экрана при lat=90 — только через формулы.
- Запрещено пропускать нормализацию углов.
- Запрещено возвращать NaN: защитные clamps / fallback при вырожденных cos.

---

## 4.7 Тесты (минимум)

См. также 07 / 09. Обязательные oracles:

1. `normalizeHours(25) === 1`, `normalizeDeg(-90) → корректный диапазон`.
2. При `latitudeDeg = 90`, для Polaris `altitudeDeg` ≈ `decDeg` (≈ 89.26°) — в пределах **1°**.
3. При `latitudeDeg = 0`, звезда с `dec = 0` и HA = 0 имеет altitude ≈ 90° (в меридиане).
4. Stereographic: zenith → центр canvas; точка на горизонте → на окружности купола (±2 px при фиксированном размере).
5. Южная звезда (Crux) при lat = +55° часто `altitude < 0` (невидима) при любом LST — oracle: max altitude over day < 0 для α Cru на Москве (Dec ≈ −63° → max alt ≈ 90−55−63 < 0).

---

## 4.8 Критерий готовности документа 04

Math service + domain utils реализованы полностью, pipeline LST→altaz→stereo работает, тесты oracles зелёные.
