# 07 — Features Extended

Все пункты этого документа **обязательны**. Это не backlog.

---

## 7.1 Location presets

Файл констант: `core/constants/location-presets.constants.ts` (значения Appendix A §A.4).

| Id | Lat | Lon | Назначение |
|----|-----|-----|------------|
| `moscow` | 55.7558 | 37.6173 | Default J1 |
| `equator` | 0 | 0 | Экваториальный вид |
| `north-pole` | 90 | 0 | Polaris near zenith |
| `south-pole` | −90 | 0 | Южное небо / Crux |

UI: кнопки в observer panel + hotkeys `1`…`4`.

---

## 7.2 Theme toggle

- Default: `dark` (Midnight Space Dark).
- `light` переключает CSS variables на панелях; canvas купол остаётся тёмным ночным небом (**канон:** небо всегда «ночь», меняется только chrome UI).
- Persist опционален (localStorage) — допустимо, не обязательно.

---

## 7.3 i18n RU / EN

Структура:
```
i18n/
  locale.type.ts
  i18n.keys.ts
  dictionaries/ru.ts
  dictionaries/en.ts
services/i18n.service.ts
```

Требования:
- `I18nService.locale` = signal.
- `t(key: string): string` — lookup текущего словаря; fallback key→latin/raw.
- Переключение `I` или toolbar button меняет **все** UI-строки панелей.
- Имена звёзд и созвездий имеют ключи в обоих словарях (минимум для всех объектов каталога).

Не использовать `@angular/localize` build-time как единственный механизм.

---

## 7.4 Hotkeys

Реализация: `HotkeysService` слушает `window:keydown`, игнорирует ввод в `<input>`/`<textarea>`.

Полная таблица — Appendix A §A.6. Минимум из документа 01 обязан работать.

---

## 7.5 Unit tests (обязательные файлы)

| Spec file | Что покрыть |
|-----------|-------------|
| `julian.util.spec.ts` | JD для известной даты (oracle B.8) |
| `sidereal.util.spec.ts` | GMST/LST нормализация диапазона; sanity vs formula |
| `coordinates.util.spec.ts` | Polaris @ lat=90; equator transit; Crux invisible @ Moscow |
| `stereographic.util.spec.ts` | Zenith→center; horizon→rim |

Допустимо добавить `astro-math.service.spec.ts` как интеграционный тонкий слой.

Команда: `npm test` / `ng test` должна прогонять эти specs.

---

## 7.6 README.md

Обязательные секции:
1. Описание продукта AstroMap Pro.
2. Требования: Node/npm.
3. Установка и запуск (`npm install`, `npm start`).
4. Тесты (`npm test`).
5. Кратко: каталог звёзд, LST, stereographic.
6. Hotkeys summary.
7. Prefix `amp`, Angular 22+.

---

## 7.7 Quality gates

Генератор **проваливает** задачу, если в коде есть:
- `// TODO`, `// ...`, `// аналогично`, `// логика аналогична`
- `*ngIf`, `*ngFor`, `*ngSwitch`
- `BehaviorSubject` / `Subject` для map/UI state
- Three.js / Babylon / WebGL frameworks
- Пустые stub methods
- Каталог < 50 звёзд
- Orthographic вместо Stereographic
- Отсутствие rename-locked файлов брифа

---

## 7.8 Допустимые polish (обязательны, если не конфликтуют)

1. Кнопка **Now** в time player.
2. Форматирование RA как `XXh YYm`, Dec как `±DD° MM′`.
3. Мягкий glow у звёзд brighter than mag 1.0.
4. Подпись созвездия рядом с фигурой при hover (опциональный label, не более одного).

---

## 7.9 Критерий готовности документа 07

Presets, theme, i18n, hotkeys, tests, README и quality gates выполнены целиком.
