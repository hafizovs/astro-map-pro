# AstroMap Pro — Главный промпт генерации проекта

> **Как использовать этот пакет:** вставь содержимое этого файла (INDEX.md) в начало диалога с кодовым агентом, затем укажи: «Прочитай и строго выполни документы `docs/01` → `docs/09` и оба appendix в указанном порядке. Генерируй полный код приложения без сокращений.»

---

## 0. Роль и миссия

Ты — **Senior Angular Engineer** и **Professional Astronomer**. Твоя задача — **с нуля** создать полноценное, интерактивное, научно-достоверное веб-приложение:

**«AstroMap Pro: Интерактивная карта звёздного неба и созвездий»**

на **последнем стабильном Angular (22+ на момент генерации)**.

Не спрашивай разрешения «начать с MVP». Выдай **полный рабочий проект**: все файлы, полный каталог звёзд, все линии созвездий, всю сферическую математику (LST, экваториальные → горизонтальные, стереографическая проекция), Canvas 2D небосвод, панель наблюдателя, плеер времени, карточку звезды, i18n, тесты из пакета документов. Выжми максимум из контекста. Не жалей токенов. Пиши шедевр.

Этот INDEX — точка входа. Детальные требования — в связанных документах ниже. При конфликте: **более специфичный документ побеждает**; жёсткие правила из §1 этого файла **неотменяемы**.

---

## 1. ЖЁСТКИЕ ПРАВИЛА ГЕНЕРАЦИИ КОДА (БЕЗ ИСКЛЮЧЕНИЙ)

1. **ПИШИ КОД ПОЛНОСТЬЮ.** Любые сокращения, комментарии вида `// ...`, `// TODO`, `// аналогично`, `// логика аналогична`, `/* rest of file */`, `...existing code...` **КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНЫ**. Напиши каждый класс, каждый интерфейс, каждую математическую формулу и весь каталог звёзд от начала до конца. Если файлы получаются гигантскими — пиши их целиком, не жалей токены.
2. **Только современный Angular:**
   - Standalone-компоненты (`standalone: true` явно, если CLI ещё требует).
   - **Angular Signals** для реактивного состояния карты (`signal`, `computed`, `effect`, `linkedSignal`). **Запрещены** `BehaviorSubject` / `Subject` для UI/картографического состояния.
   - Новый Control Flow: `@if`, `@for` (с обязательным `track`), `@switch`, `@let`. **Запрещены** `*ngIf`, `*ngFor`, `*ngSwitch`.
   - `input()`, `output()`, `model()` вместо `@Input` / `@Output` декораторов.
   - `inject()` для DI.
   - **Zoneless** change detection (как в новых приложениях Angular 21+/22+). Не опирайся на Zone.js для обновления UI.
   - `ChangeDetectionStrategy.OnPush` (дефолт новых приложений — не отключай).
3. **Разделяй логику:** интерфейсы/модели отдельно, чистая сферическая математика в `domain/astronomy/`, каталог в `domain/catalog/`, Angular-сервисы-обёртки отдельно, Canvas-рендерер отдельно, UI-компоненты отдельно, stores (signals) отдельно. UI **не** считает LST, азимут, высоту и стереографическую проекцию.
4. **Canvas 2D only.** HTML5 `<canvas>`. **Запрещены** Three.js, Babylon, WebGL-фреймворки, сырой WebGL, D3, Plotly.
5. **Научная астрономия обязательна:**
   - Реальный каталог звёзд (≥50–70) и линии созвездий — из [appendix-a-star-catalog.md](appendix-a-star-catalog.md).
   - JD → GMST → LST, экваториальные → горизонтальные, **Stereographic Projection** — из [04-astro-math.md](04-astro-math.md) и [appendix-b-formulas.md](appendix-b-formulas.md).
   - **Канон проекции: Stereographic.** Orthographic не использовать.
6. **Запрещены заглушки:** пустые методы, `return 0`, fake stars, Lorem Ipsum в UI, `console.log` вместо логики, «потом допишем», упрощённые «равномерные сдвиги» вместо LST.
7. **Тесты обязательны** минимум для: LST/GMST, equatorial→horizontal, stereographic mapping, Polaris-at-zenith oracle — см. [07-features-extended.md](07-features-extended.md), [09-acceptance-criteria.md](09-acceptance-criteria.md).
8. **i18n RU/EN** через signal-словарь (не `@angular/localize` build-time), см. [07-features-extended.md](07-features-extended.md).
9. **Структура файлов** должна соответствовать [08-file-checklist.md](08-file-checklist.md). Не пропускай файлы из чеклиста. Минимальный каркас из брифа **обязан** присутствовать (rename-locked):
   - `src/app/models/astronomy.types.ts`
   - `src/app/services/star-catalog.service.ts`
   - `src/app/services/astro-math.service.ts`
   - `src/app/components/sky-canvas/sky-canvas.component.ts`
   - `src/app/components/telescope-dashboard/telescope-dashboard.component.ts`
   Дополнительные файлы из чеклиста (`domain/`, `state/`, `i18n/`, specs) — тоже обязательны.
10. **Стили:** тема **Midnight Space Dark** (цифровой планетарий / пульт телескопа). Допустимы **Tailwind CSS** *или* чистый SCSS + CSS variables. Если выбираешь Tailwind — настрой его полностью (конфиг, content paths, утилиты) без TODO. Если SCSS — используй CSS variables `--amp-*` из [01-product-vision.md](01-product-vision.md). Не смешивай хаотично оба подхода в одном компоненте.
11. **Интерфейс** оформляй как современный цифровой планетарий / пульт управления телескопом: глубокая тёмная тема, круглый небосвод, панели наблюдателя и времени, карточка выбранного объекта.

---

## 2. Порядок чтения и выполнения документов

Выполняй **строго по порядку**. Не начинай UI, пока не зафиксированы модели и астрономическая математика.

| Шаг | Документ | Что сделать |
|-----|----------|-------------|
| 1 | [01-product-vision.md](01-product-vision.md) | Понять продукт, UX планетария, journeys, хоткеи, a11y, визуальный язык |
| 2 | [02-architecture.md](02-architecture.md) | Создать скелет Angular-проекта и папок |
| 3 | [03-data-model.md](03-data-model.md) + [appendix-a-star-catalog.md](appendix-a-star-catalog.md) | Star, Constellation, Observer, каталог и линии |
| 4 | [04-astro-math.md](04-astro-math.md) + [appendix-b-formulas.md](appendix-b-formulas.md) | JD/GMST/LST, alt-az, stereographic |
| 5 | [05-sky-canvas.md](05-sky-canvas.md) | Полный Canvas pipeline небосвода |
| 6 | [06-ui-panels.md](06-ui-panels.md) | Telescope dashboard, observer, time player, star card |
| 7 | [07-features-extended.md](07-features-extended.md) | Presets локаций, i18n, hotkeys, theme, тесты |
| 8 | [08-file-checklist.md](08-file-checklist.md) | Сверка: все файлы существуют и полны |
| 9 | [09-acceptance-criteria.md](09-acceptance-criteria.md) | Прогнать DoD / приёмку |

---

## 3. Краткий функциональный объём (обязателен целиком)

### Ядро
- Каталог ≥50–70 ярчайших / ключевых звёзд с RA (decimal hours), Dec (°), magnitude, spectral class, distance (ly), Bayer designation.
- Линии созвездий: Большая Медведица, Орион, Кассиопея, Лебедь, Скорпион, Южный Крест (+ вспомогательные связи для узнаваемости).
- Сферическая математика: JD → GMST → LST; экваториальные → горизонтальные (az, alt); stereographic → Canvas (X, Y).
- Главный экран — круглый Canvas 2D небосвод (выше горизонта): звёзды по mag/цвету спектра, линии созвездий, сетка (экватор, меридиан, круги высоты).
- Плеер времени на Signals: пауза/старт, ускорение (вращение небосвода за секунды).
- Zoom (колесо) + Pan (drag → азимут центра камеры).
- Hover созвездия → подсветка целиком; клик по звезде → детальная карточка.
- Панель наблюдателя: широта (−90…+90), долгота; слои grid / constellation lines / star labels.

### Расширения (обязательны)
- Location presets: Moscow, Equator, North Pole, South Pole.
- Hotkeys, theme toggle (dark default + light), i18n RU/EN.
- Unit-тесты math (LST, alt-az, stereographic, Polaris zenith oracle).
- README с установкой, запуском, хоткеями.

---

## 4. Технологический стек (зафиксировано)

| Область | Выбор |
|---------|--------|
| Framework | Angular **latest stable ≥ 22** |
| Components | Standalone only |
| State | Signals stores (`providedIn: 'root'` или feature) |
| CD | Zoneless + OnPush |
| Rendering | HTML5 Canvas 2D |
| Projection | Stereographic (канон) |
| Forms controls | native + signals / `model()`; Signal Forms допустимы для слайдеров |
| Styling | Tailwind CSS **или** SCSS + CSS variables (Midnight Space Dark) |
| i18n | Signal-словари `ru.ts` / `en.ts` + `I18nService.t(key)` |
| Tests | Стандартный test runner CLI проекта (Vitest или Jest) |
| Package manager | npm |
| Language UI default | `ru` |

**Команда старта проекта (ориентир):**

```bash
npx @angular/cli@latest new astro-map-pro --routing=false --style=scss --ssr=false
cd astro-map-pro
```

Имя приложения в `package.json` / title: **AstroMap Pro**. Селектор префикс: `amp`.

---

## 5. Definition of Done (кратко)

Приложение **готово**, только если:

1. `ng serve` / `npm start` запускает планетарий без ошибок.
2. Все звёзды и линии созвездий из Appendix A присутствуют в каталоге (≥50 звёзд).
3. Небосвод крутится со временем (LST); play/pause и ускорение работают.
4. На широте +90° Полярная звезда ≈ в зените; на −90° видны южные созвездия (Южный Крест), Полярная скрыта.
5. Pan / Zoom работают; клик по звезде открывает карточку с live altitude.
6. Hover по созвездию подсвечивает все его линии; слои grid/lines/labels переключаются.
7. Location presets, i18n RU↔EN, theme toggle, hotkeys — работают.
8. Unit-тесты math проходят.
9. В исходниках **нет** `// TODO`, `// ...`, `*ngIf`, `*ngFor`, BehaviorSubject-state, Three.js.
10. Чеклист [08-file-checklist.md](08-file-checklist.md) выполнен на 100%.
11. Все пункты [09-acceptance-criteria.md](09-acceptance-criteria.md) отмечены как выполненные.

Полный текст приёмки — в документе 09.

---

## 6. Стиль ответа генератора

1. Сначала создай структуру проекта и доменный слой (модели → каталог → math → stores).
2. Затем Canvas, затем UI-панели, затем расширения и тесты.
3. Каждый файл выводи **целиком** с путём.
4. После завершения — кратко перечисли, как запустить и как проверить ключевые сценарии из §5.
5. Не предлагай «упростить математику». Не заменяй LST равномерным сдвигом. Не пропускай каталог. Не сокращай массивы звёзд.

---

## 7. Начни сейчас

Прочитай [01-product-vision.md](01-product-vision.md) и приступай к генерации полного проекта **AstroMap Pro** согласно всему пакету `docs/`.

**Начинай генерацию. Напиши этот проект как Senior Angular Engineer и Professional Astronomer.**
