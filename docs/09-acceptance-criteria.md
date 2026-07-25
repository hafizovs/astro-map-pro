# 09 — Acceptance Criteria & Definition of Done

Чеклист приёмки. Генератор после завершения работ **обязан** пройти каждый пункт. Пункт провален → доработать код, не оправдываться.

---

## 9.1 Build & Run

- [ ] `npm install` завершается без ошибок
- [ ] `npm start` / `ng serve` поднимает приложение
- [ ] Консоль браузера без ошибок runtime при старте
- [ ] Нет красных ошибок Angular (NG0xxx) в консоли
- [ ] Zoneless: play/pause, sliders, selection обновляют UI без Zone.js hacks

---

## 9.2 Научная достоверность / астрономия

- [ ] Каталог содержит **не менее 50** звёзд из Appendix A со всеми полями (RA, Dec, mag, spectral, ly, Bayer)
- [ ] Линии созвездий присутствуют для UMa, Ori, Cas, Cyg, Sco, Cru (и связанных id)
- [ ] Используется JD → GMST → LST (не «равномерный сдвиг»)
- [ ] Equatorial → Horizontal реализовано по формулам Appendix B
- [ ] Проекция — **Stereographic** (не Orthographic)
- [ ] При lat = +90° altitude Polaris ≈ Dec Polaris (≈ 89.26° ± 1°)
- [ ] При lat = +55.76° (Moscow) α Crucis остаётся ниже горизонта (altitude max < 0)
- [ ] При lat = −90° южные звёзды Crux доступны в принципе (Dec < 0 видны над горизонтом в модели полюса)
- [ ] Звёзды с altitude < 0 не рисуются
- [ ] Цвет точки соответствует spectral class; размер/alpha — magnitude

---

## 9.3 Canvas / визуализация

- [ ] Круглый небосвод с clip и кольцом горизонта
- [ ] Сетка: круги высоты + меридиан + экватор (при включённом слое)
- [ ] Линии созвездий тонкие полупрозрачные
- [ ] Hover подсвечивает созвездие целиком
- [ ] Selected star имеет визуальный акцент
- [ ] Labels включаются/выключаются тумблером
- [ ] Resize окна не ломает canvas (DPR учтён)
- [ ] Нет Three.js / WebGL frameworks

---

## 9.4 Камера / взаимодействие

- [ ] Pan drag меняет center azimuth
- [ ] Wheel zoom в пределах min/max
- [ ] Click по звезде открывает карточку
- [ ] Esc снимает selection
- [ ] Hit-test устойчив (slop), не выбирает невидимые звёзды

---

## 9.5 Время

- [ ] Play/Pause работает (Space)
- [ ] Ускорение времени заметно вращает небосвод через LST
- [ ] Пресеты скорости Hour/sec, Day/sec, Week/sec работают
- [ ] Slider скорости работает
- [ ] При паузе небо заморожено
- [ ] Readout даты/времени обновляется

---

## 9.6 Observer / карточка

- [ ] Слайдеры lat/lon меняют вид неба
- [ ] Live LST отображается
- [ ] Presets Moscow / Equator / N Pole / S Pole работают (hotkeys 1–4)
- [ ] Layer toggles: grid, constellation lines, labels
- [ ] Карточка показывает: name, Bayer, constellation, distance ly, RA/Dec, live altitude (и az), mag, spectral
- [ ] Метрики altitude/az live обновляются во время play

---

## 9.7 Расширения

- [ ] i18n: переключение RU↔EN меняет UI-строки
- [ ] Theme dark/light переключает chrome панелей
- [ ] Hotkeys из Appendix A §A.6 работают
- [ ] README содержит install/start/test/hotkeys

---

## 9.8 Архитектура / качество кода

- [ ] Standalone components only
- [ ] Signals для состояния; нет BehaviorSubject-state
- [ ] Control flow `@if`/`@for`/`@switch`; нет `*ngIf`/`*ngFor`
- [ ] UI panels не импортируют sidereal/coordinates/stereographic напрямую
- [ ] Rename-locked файлы брифа существуют:
  - [ ] `src/app/models/astronomy.types.ts`
  - [ ] `src/app/services/star-catalog.service.ts`
  - [ ] `src/app/services/astro-math.service.ts`
  - [ ] `src/app/components/sky-canvas/sky-canvas.component.ts`
  - [ ] `src/app/components/telescope-dashboard/telescope-dashboard.component.ts`
- [ ] Нет `// TODO`, `// ...`, `// аналогично`, placeholder Lorem
- [ ] Структура соответствует [08-file-checklist.md](08-file-checklist.md)

---

## 9.9 Тесты

- [ ] `julian.util.spec.ts` проходит
- [ ] `sidereal.util.spec.ts` проходит
- [ ] `coordinates.util.spec.ts` проходит (включая Polaris/Crux oracles)
- [ ] `stereographic.util.spec.ts` проходит
- [ ] `npm test` / `ng test` завершается успешно (или с допустимой конфигурацией CLI без падений assertion)

---

## 9.10 Journeys smoke

- [ ] J1 First launch (Moscow, dark, ru, playing)
- [ ] J2 North Pole → Polaris near zenith
- [ ] J3 Time acceleration rotates sky
- [ ] J4 Click star → detail card
- [ ] J5 Hover constellation highlight
- [ ] J6 South Pole qualitatively different sky

---

## 9.11 Финальная декларация генератора

После выполнения всех пунктов выше генератор **обязан** вывести:

1. Команды запуска: `npm install`, `npm start`, `npm test`.
2. Подтверждение: каталог ≥50 звёзд, Stereographic, rename-locked пути на месте.
3. Как проверить J2 и J3 вручную (2–3 предложения).
4. Явную фразу: **AstroMap Pro готов по чеклисту 09.**

Если любой checkbox ложен — декларация запрещена; сначала исправь код.
