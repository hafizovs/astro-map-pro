# 01 — Product Vision & UX

Документ обязателен к исполнению целиком. Генератор кода не имеет права упрощать сценарии или выкидывать режимы.

---

## 1.1 Продукт

| Поле | Значение |
|------|----------|
| Название | **AstroMap Pro** |
| Подзаголовок (RU) | Интерактивная карта звёздного неба и созвездий |
| Подзаголовок (EN) | Interactive Star Map & Constellations |
| Тип | SPA, образовательно-научный цифровой планетарий |
| Платформа | Современный desktop Chrome/Firefox/Edge; mobile — usable (sidebar collapsible), desktop — primary |
| Рендер | HTML5 Canvas 2D |
| Проекция | Stereographic (канон) |
| Научный уровень | Реальная небесная сфера: экваториальные координаты → горизонтальные через LST; без прецессии/нутации/рефракции (образовательный уровень J2000 approx) |

**Ценность:** показать, как выглядит ночное небо с заданной точки Земли в заданное время, как вращается небосвод и как меняется картина при смене широты — с узнаваемыми созвездиями и научно корректной геометрией.

**Аудитория:** студенты, преподаватели, энтузиасты астрономии, разработчики, изучающие Angular + canvas + сферическую геометрию.

---

## 1.2 Информационная архитектура экрана

Один главный экран (без роутинга страниц):

```
┌────────────────────────────────────────────────────────────────────┐
│ Toolbar: brand AstroMap Pro | theme | lang | presets | layers hint │
├────────────────────────────────────┬───────────────────────────────┤
│                                    │ Observer Panel                │
│                                    │  - lat / lon sliders          │
│         Sky Canvas (circular)      │  - live LST                   │
│         full available area        │  - layer toggles              │
│                                    │  - location presets           │
│                                    │ Star Detail Card (if selected)│
├────────────────────────────────────┴───────────────────────────────┤
│ Bottom bar: Time Player | speed | play/pause | date/time readout   │
└────────────────────────────────────────────────────────────────────┘
```

- Canvas занимает всю доступную область под toolbar и над bottom bar; небосвод рисуется как **круг** (видимая полусфера).
- Sidebar справа, ширина **340px** desktop; на ширине `< 900px` — overlay с кнопкой закрытия.
- Z-index: canvas (0) < panels (10) < banners/toasts (20) < overlays (30).

---

## 1.3 Визуальный язык (Midnight Space Dark)

Интерфейс — **цифровой планетарий / пульт телескопа**, не «админ-дашборд».

### CSS variables (обязательный набор `--amp-*`)

```css
:root, [data-theme="dark"] {
  --amp-bg-deep: #05070d;
  --amp-bg-panel: #0b1020;
  --amp-bg-elevated: #121a2e;
  --amp-border: #1e2a44;
  --amp-text: #e8eefc;
  --amp-text-muted: #8b9bb8;
  --amp-accent: #5ec8ff;
  --amp-accent-warm: #ffb454;
  --amp-danger: #ff6b7a;
  --amp-grid: rgba(94, 200, 255, 0.18);
  --amp-constellation: rgba(180, 200, 255, 0.35);
  --amp-constellation-hover: rgba(255, 220, 140, 0.85);
  --amp-horizon-ring: rgba(232, 238, 252, 0.45);
  --amp-font-display: "Orbitron", "Exo 2", "Segoe UI", sans-serif;
  --amp-font-body: "IBM Plex Sans", "Source Sans 3", "Segoe UI", sans-serif;
  --amp-font-mono: "IBM Plex Mono", "JetBrains Mono", monospace;
}

[data-theme="light"] {
  --amp-bg-deep: #e8eef8;
  --amp-bg-panel: #f5f8ff;
  --amp-bg-elevated: #ffffff;
  --amp-border: #c5d0e6;
  --amp-text: #0b1424;
  --amp-text-muted: #4a5a78;
  --amp-accent: #0a7ebc;
  --amp-accent-warm: #c76a00;
}
```

**Запрещено** для шрифтов: Inter, Roboto, Arial, system-ui как единственный display-стек.

### Atmosphere
- Глубокий тёмный фон с тонким радиальным/градиентным свечением вокруг купола (не плоский solid).
- Панели — матовые, тонкие бордеры, без карточек-«коробок» в герое; карточка звезды допустима как контейнер взаимодействия.
- Canvas-круг с тонким кольцом горизонта.

### Motion (минимум 2–3)
1. Плавное смещение звёзд при playback (через rAF + time signal).
2. Fade/glow подсветки созвездия при hover (≈150–200 ms).
3. Появление карточки выбранной звезды (opacity/translate, ≈180 ms).

### Visual bans
- Purple-on-white / purple-indigo градиентные клише.
- Warm cream + terracotta newspaper look.
- Emoji в UI-хромах.
- Detached floating badges поверх небосвода.
- Stat strips / pill clusters в первом viewport.

---

## 1.4 User Journeys (обязательные сценарии)

### J1 — Первый запуск
1. Пользователь открывает приложение.
2. Тема: **dark**. Locale: **ru**.
3. Observer: пресет **Moscow** (lat ≈ 55.7558°, lon ≈ 37.6173°).
4. Time: **playing**, скорость по умолчанию = **1 симуляционный час за 1 реальную секунду** (см. Appendix A).
5. Камера: азимут центра ≈ 180° (юг), zoom = 1.0 так, чтобы горизонтный круг заполнял canvas с padding.
6. Видны: звёзды выше горизонта, линии созвездий, сетка **включена**, labels **выключены**.
7. Карточка звезды скрыта.

### J2 — Полярная в зените
1. Пользователь двигает широту до **+90°** (или пресет North Pole).
2. Полярная звезда (`polaris`) оказывается **почти в зените** (altitude ≈ 90° ± небольшая поправка из-за Dec ≠ +90°; Dec Polaris ≈ +89.26° → alt ≈ lat − (90 − Dec) ≈ 89.26°).
3. Южные созвездия (Южный Крест) **не видны** (ниже горизонта).
4. Live altitude в карточке (если выбрать Polaris) отражает это.

### J3 — Вращение небосвода
1. Пользователь ставит ускорение (например ×60 или пресет «1 day / sec»).
2. Звёзды плавно смещаются по куполу (суточное вращение через LST).
3. Pause останавливает смещение; Play продолжает.
4. Дата/время readout обновляется.

### J4 — Клик по звезде
1. Пользователь кликает по яркой звезде (например Вега / Сириус — если над горизонтом).
2. Открывается Star Detail Card: name, Bayer, constellation, distance ly, RA/Dec, live altitude (и азимут).
3. Звезда визуально выделена (кольцо/glow).
4. Esc или кнопка закрытия снимает selection.

### J5 — Hover созвездия
1. Курсор над линией или звездой созвездия Орион.
2. Все линии Ориона подсвечиваются `--amp-constellation-hover`.
3. Уход курсора снимает подсветку (если созвездие не закреплено selection — selection звезды не обязан держать hover).

### J6 — Южное небо
1. Пресет **South Pole** (lat = −90°) или слайдер.
2. Полярная скрыта; видны α/β/γ/δ Crucis (Южный Крест) при подходящем LST/времени (или пользователь крутит время, пока Крест не взойдёт — на полюсе «восход» иной, но южные звёзды с Dec < 0 доступны).
3. Картина неба качественно отличается от московской.

---

## 1.5 Горячие клавиши

Полная таблица — в [appendix-a-star-catalog.md](appendix-a-star-catalog.md) §A.6. Минимум:

| Key | Action |
|-----|--------|
| Space | Play / Pause |
| `+` / `=` | Ускорить время |
| `-` | Замедлить время |
| `G` | Toggle grid |
| `C` | Toggle constellation lines |
| `L` | Toggle star labels |
| `1`…`4` | Location presets (Moscow, Equator, N Pole, S Pole) |
| Esc | Clear star selection / close overlay sidebar |
| `T` | Theme toggle |
| `I` | Locale RU↔EN |

---

## 1.6 Accessibility (минимум)

- Все контролы панелей доступны с клавиатуры (sliders, buttons, toggles).
- Контраст текста панелей WCAG AA на тёмной теме.
- Canvas: pointer + keyboard не обязателен для hit-test звёзд, но selection можно снять Esc; список ярких звёзд в карточке/панели не обязателен, но button states должны иметь focus ring.
- `aria-label` на ключевых кнопках play/pause, theme, lang.
- Не полагаться только на цвет для hover созвездия — допустимо увеличение толщины линии.

---

## 1.7 Non-functional requirements

| NFR | Требование |
|-----|------------|
| Perf | Стабильный rAF; 60 звёзд + линии + сетка без лагов на desktop |
| Resize | Canvas пересчитывает размер и DPR |
| Routing | Нет `@angular/router` page routes |
| SSR | Нет |
| Offline | Работает без сети после загрузки (данные hardcoded) |
| README | Установка, start, test, hotkeys, краткое описание математики |

---

## 1.8 Критерий готовности документа 01

Генератор понял продукт, IA, journeys J1–J6, визуальный язык Midnight Space Dark и не упрощает сценарии полюсов / времени / клика по звезде.
