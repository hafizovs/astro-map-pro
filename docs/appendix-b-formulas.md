# Appendix B — Formulas & Algorithms

Справочник формул. Реализации — в `domain/astronomy/*` согласно [04-astro-math.md](04-astro-math.md).

---

## B.1 Обозначения

| Symbol | Meaning | Unit |
|--------|---------|------|
| \(\alpha\) / RA | Right Ascension | hours (decimal) |
| \(\delta\) / Dec | Declination | degrees |
| \(\phi\) | Observer latitude | degrees |
| \(\lambda\) | Observer longitude (East +) | degrees |
| \(\theta\) / LST | Local Sidereal Time | hours |
| \(H\) / HA | Hour Angle | hours or degrees (explicit) |
| \(a\) / alt | Altitude | degrees |
| \(A\) / az | Azimuth (0=N, 90=E) | degrees |
| JD | Julian Date | days |
| \(T\) | Julian centuries from J2000.0 | centuries |

---

## B.2 Julian Date from UTC

Пусть `utcMs` — Unix epoch milliseconds (UTC).

```
function julianDate(utcMs):
  // Unix epoch 1970-01-01 00:00:00 UTC = JD 2440587.5
  return utcMs / 86400000 + 2440587.5
```

Julian centuries from J2000.0:

```
function julianCenturies(jd):
  return (jd - 2451545.0) / 36525.0
```

**Oracle (тест):**  
UTC `2000-01-01T12:00:00.000Z` → JD = **2451545.0**.

---

## B.3 GMST & LST

### GMST (hours)

Используй формулу (образовательный стандарт, Meeus / IAU approx):

\[
\mathrm{GMST}_{\mathrm{deg}} = 280.46061837 + 360.98564736629\,(JD - 2451545.0) + 0.000387933\,T^{2} - \frac{T^{3}}{38710000}
\]

где \(T = (JD - 2451545.0)/36525\).

```
function gmstHours(jd):
  T = (jd - 2451545.0) / 36525.0
  gmstDeg = 280.46061837
           + 360.98564736629 * (jd - 2451545.0)
           + 0.000387933 * T * T
           - (T * T * T) / 38710000.0
  gmstDeg = normalizeDeg(gmstDeg)   // [0, 360)
  return gmstDeg / 15.0             // hours [0, 24)
```

### LST

\[
\mathrm{LST}_{\mathrm{hours}} = \mathrm{GMST}_{\mathrm{hours}} + \lambda / 15
\]

```
function lstHours(utcMs, longitudeDeg):
  jd = julianDate(utcMs)
  lst = gmstHours(jd) + longitudeDeg / 15.0
  return normalizeHours(lst)  // [0, 24)
```

---

## B.4 Equatorial → Horizontal

Вход: \(\alpha\) (hours), \(\delta\) (deg), LST (hours), \(\phi\) (deg).

Hour angle in hours, then degrees:

\[
H_{\mathrm{h}} = \mathrm{LST} - \alpha
\]

\[
H = 15^{\circ} \cdot H_{\mathrm{h}}
\]

Altitude:

\[
\sin a = \sin\delta\sin\phi + \cos\delta\cos\phi\cos H
\]

\[
a = \arcsin(\sin a)
\]

Azimuth (0 = North, 90 = East) — канонический вариант:

\[
\cos A = \frac{\sin\delta - \sin a\sin\phi}{\cos a\cos\phi}
\]

\[
\sin A = -\frac{\cos\delta\sin H}{\cos a}
\]

\[
A = \mathrm{atan2}(\sin A, \cos A) \quad\text{(в градусы, normalize }[0,360))
\]

```
function equatorialToHorizontal(raHours, decDeg, lstHours, latDeg):
  HAh = normalizeHours(lstHours - raHours)
  H = degToRad(HAh * 15)
  dec = degToRad(decDeg)
  lat = degToRad(latDeg)

  sinAlt = sin(dec)*sin(lat) + cos(dec)*cos(lat)*cos(H)
  sinAlt = clamp(sinAlt, -1, 1)
  alt = asin(sinAlt)

  cosAlt = cos(alt)
  if abs(cosAlt) < 1e-12:
    // near zenith/nadir: azimuth undefined — return previous or 0
    az = 0
  else:
    sinAz = -cos(dec) * sin(H) / cosAlt
    cosAz = (sin(dec) - sin(alt)*sin(lat)) / (cosAlt * cos(lat))
    az = atan2(sinAz, cosAz)  // radians
    az = normalizeDeg(radToDeg(az))

  return { azimuthDeg: az, altitudeDeg: radToDeg(alt) }
```

**Oracle A — Polaris @ North Pole:**  
`lat = 90`, any LST, Polaris `dec ≈ 89.2641` → `altitudeDeg ≈ 89.2641` (±1°).

**Oracle B — Equator transit:**  
`lat = 0`, `dec = 0`, `HA = 0` → `altitude ≈ 90°`.

**Oracle C — Crux @ Moscow:**  
`lat = 55.7558`, star `acrux` `dec ≈ -63.0991` →  
\(a_{\max} \approx 90 - |\phi - \delta|\) simplified upper bound:  
\(a_{\max} \approx 90 - 55.7558 - 63.0991 < 0\) → всегда ниже горизонта.

---

## B.5 Stereographic projection (канон)

Проекция видимой полусферы с полюсом проекции в **зените** на плоскость горизонта.

Пусть \(z = 90^\circ - a\) — zenith distance в градусах.  
Только \(a \ge 0\) ( \(z \le 90^\circ\) ).

Радиус на единичной стереографической плоскости (проекция с сферы радиуса 1 на плоскость касания в зените / эквивалент):

\[
r = \tan\left(\frac{z}{2}\right) = \tan\left(\frac{90^\circ - a}{2}\right)
\]

Угол на плоскости (от севера, по часовой к востоку — согласуй с canvas Y-down):

\[
\psi = A - A_{\mathrm{center}}
\]

где \(A_{\mathrm{center}} = \) `camera.centerAzimuthDeg`.

Canvas mapping:

```
function projectHorizontalToCanvas(altDeg, azDeg, centerAzDeg, zoom, width, height):
  if altDeg < 0:
    return { x:0, y:0, visible:false }

  z = 90 - altDeg
  // stereographic radius in "projection units"
  r = tan(degToRad(z / 2))

  // dome radius in pixels
  R = min(width, height) * DOME_RADIUS_FACTOR * zoom
  // horizon corresponds to z=90° → r = tan(45°) = 1
  // so scale projection units → pixels: multiply by R
  scale = R   // because r_horizon = 1

  psi = degToRad(azDeg - centerAzDeg)
  // North up on map: az=0 → up. Canvas Y grows down ⇒ y negative when north.
  x = width/2  + scale * r * sin(psi)
  y = height/2 - scale * r * cos(psi)

  // outside dome safety
  if (x - width/2)^2 + (y - height/2)^2 > (R + 0.5)^2:
    // still visible conceptually if alt>=0; clip will hide
    pass

  return { x, y, visible:true }
```

**Oracle D — Zenith:** `alt = 90` → `r = 0` → `(x,y) = center`.  
**Oracle E — Horizon:** `alt = 0` → `r = 1` → точка на окружности радиуса `R`.

`zoom > 1` увеличивает `R` (приближение); clamp zoom per Appendix A.

---

## B.6 Magnitude & spectral class

```
function magnitudeToRadiusPx(mag, zoom):
  // smaller mag → larger star
  raw = RADIUS_BASE_PX * pow(10, -0.2 * (mag - MAG_REF)) * zoom
  return clamp(raw, RADIUS_MIN_PX, RADIUS_MAX_PX)

function magnitudeToAlpha(mag):
  // bright stars more opaque
  raw = 1.1 - 0.12 * mag
  return clamp(raw, ALPHA_MIN, ALPHA_MAX)

function spectralClassToColor(sp):
  letter = upper(firstLetter(sp))
  switch letter:
    O: return "#9bb0ff"
    B: return "#aabfff"
    A: return "#cad7ff"
    F: return "#f8f7ff"
    G: return "#fff4ea"
    K: return "#ffd2a1"
    M: return "#ffcc6f"
    default: return "#e8eefc"
```

---

## B.7 Hit-test

```
function findStarAtPointer(projected, px, py, slop=HIT_SLOP_PX):
  best = null
  bestDist = +inf
  for p in projected where p.screen.visible:
    d = hypot(p.screen.x - px, p.screen.y - py)
    limit = max(p.radiusPx, slop)
    if d <= limit and d < bestDist:
      bestDist = d
      best = p.star
  return best

function distToSegment(px, py, x1, y1, x2, y2):
  // standard point-to-segment distance

function findConstellationAtPointer(projected, constellations, px, py, slop):
  star = findStarAtPointer(...)
  if star: return constellationById(star.constellationId)

  best = null
  bestDist = +inf
  for c in constellations:
    for edge in c.edges:
      p1 = projectedById(edge.fromStarId)
      p2 = projectedById(edge.toStarId)
      if not p1.visible or not p2.visible: continue
      d = distToSegment(px, py, p1.x, p1.y, p2.x, p2.y)
      if d <= slop and d < bestDist:
        bestDist = d
        best = c
  return best
```

---

## B.8 Test oracles (сводка)

| ID | Setup | Expect |
|----|-------|--------|
| T1 | UTC 2000-01-01 12:00Z | JD = 2451545.0 |
| T2 | `normalizeHours(25)` | `1` |
| T3 | `normalizeHours(-1)` | `23` |
| T4 | lat=90, Polaris | alt ≈ 89.2641 ± 1° |
| T5 | lat=0, dec=0, HA=0 | alt ≈ 90° |
| T6 | lat=55.7558, acrux any LST | alt < 0 |
| T7 | alt=90 stereographic | screen = canvas center |
| T8 | alt=0 stereographic | distance from center ≈ R (±2px) |

---

## B.9 Frame pipeline (сводка)

```
dt = (now - last) / 1000
timeStore.tick(dt)
lst = lstHours(time.utcMs, observer.lon)
for star in catalog.stars:
  hor = equatorialToHorizontal(star.ra, star.dec, lst, observer.lat)
  scr = projectHorizontalToCanvas(hor, camera, w, h)
  draw if scr.visible
draw constellation edges between visible endpoints
draw grid samples via same projection
```

---

## B.10 Запрещённые упрощения

- `x += omega * t` без LST
- Фиксированный «поворот массива» звёзд
- Orthographic: \(r = \cos a\) как единственная проекция
- Игнорирование longitude в LST
- Жёсткий hardcode Polaris в центр при lat=90

---

## B.11 Критерий готовности Appendix B

Все формулы реализованы в domain utils; oracles T1–T8 покрыты тестами; stereographic согласован с renderer.
