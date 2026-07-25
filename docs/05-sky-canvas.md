# 05 — Sky Canvas Renderer

Документ обязателен. Canvas 2D — единственный рендер небосвода. Полный код без сокращений.

---

## 5.1 Файлы

| Path | Content |
|------|---------|
| `components/sky-canvas/sky-canvas.component.ts` | Host, rAF, resize, wires stores/services (**RENAME-LOCKED**) |
| `components/sky-canvas/sky-canvas.component.html` | `<canvas>` + optional HUD overlay slots |
| `components/sky-canvas/sky-canvas.component.scss` | Full-area canvas, circular mask optional via CSS |
| `components/sky-canvas/sky-renderer.ts` | Imperative draw pipeline |
| `components/sky-canvas/sky-pointer.controller.ts` | Pointer down/move/up/wheel → pan/zoom/hit-test |

Selector: `amp-sky-canvas`.

---

## 5.2 Component API

```ts
@Component({
  selector: 'amp-sky-canvas',
  standalone: true,
  // …
})
export class SkyCanvasComponent {
  // inject stores + AstroMathService + StarCatalogService
  // outputs optional:
  // starSelected = output<StarId>();
}
```

Обязательное поведение внутри компонента:
- `afterNextRender` / `ngAfterViewInit` эквивалент: получить canvas, ResizeObserver, start rAF.
- `DestroyRef` / cleanup: cancelAnimationFrame, disconnect observer.
- DPR: `canvas.width = clientWidth * dpr`, drawing через `ctx.setTransform(dpr,0,0,dpr,0,0)` или scale.

---

## 5.3 Геометрия купола

- Купол — **круг** с центром `(cx, cy)` и радиусом `R = min(w, h) * 0.48 * zoomFactorMapping`.
- **Канон:** `zoom` из CameraStore увеличивает эффективный масштаб стереографической плоскости (см. B.5), горизонтный круг остаётся вписанным в viewport с padding.
- Clip: `ctx.beginPath(); arc(cx,cy,R,0,2π); clip()` перед звёздами/линиями.
- Фон внутри круга: радиальный градиент от глубокого indigo/near-black в центре к чуть более светлому у горизонта (Midnight Space).
- Вне круга: цвет `--amp-bg-deep` / panel chrome.

---

## 5.4 Порядок слоёв отрисовки (каждый кадр)

1. Clear full canvas.
2. Fill outside + dome background gradient.
3. Horizon ring.
4. **Grid** (если `showGrid`):
   - Концентрические круги высоты: 0° (горизонт), 30°, 60° (и опционально 15°/45° тоньше).
   - Линия небесного экватора: геометрическое место точек с Dec=0, спроецированных через тот же pipeline (семпл 128–256 точек по RA) — только visible сегменты.
   - Меридиан: линия az = centerAzimuth или локальный меридиан (az=0/180) — **канон:** север–юг меридиан (az = 0° и 180°) тонкими линиями через зенит.
5. **Constellation lines** (если включены): для каждого edge, если оба конца visible — линия; толщина 1px (hover 2–2.5px); цвет `--amp-constellation` / hover `--amp-constellation-hover`.
6. **Stars:** filled circles (или soft glow: radial gradient для mag < 1.5); radius/alpha/color из math helpers.
7. **Selection ring** вокруг выбранной звезды.
8. **Labels** (если включены): имя для ярких звёзд `magnitude <= 1.5` (или top-N), шрифт mono/small, не перекрывать край купола (clamp / skip).

---

## 5.5 Интерактивность

### Pan
- Pointer drag: меняет `centerAzimuthDeg` пропорционально `dx` (и опционально лёгкий tilt запрещён — только azimuth rotation, **канон: 1DOF pan = azimuth**).
- Чувствительность: константа в `render.constants.ts` (например `PAN_DEG_PER_PIXEL = 0.25`).

### Zoom
- Wheel: `zoom = clamp(zoom * factor, ZOOM_MIN, ZOOM_MAX)`.
- `ZOOM_MIN = 0.75`, `ZOOM_MAX = 3.0` (канон; можно уточнить в A.5, но диапазон обязан быть).

### Hover
- `pointermove` → hit-test constellation → `hoveredConstellationId`.
- Cursor `grab` / `grabbing` / `pointer` над звездой.

### Click
- `pointerup` без существенного drag → hit-test star → `selectStar(id)`.
- Drag threshold: 4–6 px.

---

## 5.6 Сетка — детали

Рисовать сетку **в том же проекционном пространстве**, что и звёзды (не «декоративные круги без математики» для экватора/меридиана). Концентрические круги высоты — это изовысоты: точки с фиксированным `altitude` и `azimuth ∈ [0,360)` через stereographic — это и есть концентрические окружности вокруг зенита (в стереографической проекции от зенита). Допустимо рисовать их как `arc` с радиусом `stereoRadius(altitude)`, согласованным с B.5.

Цвета: `--amp-grid`, alpha ниже у мелких делений.

---

## 5.7 Performance

- Не аллоцировать гигантские массивы строк UI на каждый кадр.
- Можно переиспользовать массив `ProjectedStar[]`.
- Labels: измерять текст умеренно (кэш ширины по id).
- 60–120 объектов — без offscreen WebGL.

---

## 5.8 Empty / edge states

- Если canvas size 0 — не рисовать / не делить на 0.
- Если каталог пуст (не должен) — пустой купол + grid.
- Resize окна пересчитывает layout без размытия (DPR).

---

## 5.9 Запреты

- Three.js / WebGL / CSS-only fake stars вместо проекции.
- Orthographic projection.
- Рисовать все звёзды каталога ниже горизонта «серыми» — **канон: не рисовать** (только alt ≥ 0).
- Пропуск clip по кругу.
- TODO в renderer.

---

## 5.10 Критерий готовности документа 05

Небосвод интерактивен: grid, линии, звёзды, hover, click, pan, zoom, rAF + DPR; визуально читается как планетарий.
