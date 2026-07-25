# Appendix A — Star Catalog, Constellations & Defaults

**Источник истины для data-файлов.** Вставляй значения в `stars.data.ts` / `constellations.data.ts` / constants **как числа из таблиц**. Не округляй «на глаз». Не пропускай строки.

Эпоха координат: **J2000.0** (образовательная точность; без прецессии на текущую эпоху).

**RA** в таблицах — **decimal hours**.  
**Dec** — градусы.  
**Mag** — видимая звёздная величина V.  
**Dist** — расстояние в световых годах (округление каталожное OK как в таблице).

---

## A.0 Naming

| Field | Value |
|-------|-------|
| npm / folder | `astro-map-pro` |
| Title | AstroMap Pro |
| Selector prefix | `amp` |
| CSS vars prefix | `--amp-*` |

---

## A.1 Каталог звёзд (обязателен целиком)

Скопируй **все** строки в `STARS: Star[]`.  
`nameKey` = `starName.<id>`; `constellationId` ссылается на §A.2.

| id | nameLatin | bayer | constellationId | raHours | decDeg | magnitude | spectralClass | distanceLy |
|----|-----------|-------|-----------------|---------|--------|-----------|---------------|------------|
| sirius | Sirius | Alpha Canis Majoris | cma | 6.7525 | -16.7161 | -1.46 | A1 | 8.6 |
| canopus | Canopus | Alpha Carinae | car | 6.3992 | -52.6957 | -0.74 | A9 | 310 |
| arcturus | Arcturus | Alpha Bootis | boo | 14.2610 | 19.1824 | -0.05 | K1.5 | 36.7 |
| vega | Vega | Alpha Lyrae | lyr | 18.6156 | 38.7837 | 0.03 | A0 | 25.0 |
| capella | Capella | Alpha Aurigae | aur | 5.2782 | 45.9980 | 0.08 | G8 | 42.9 |
| rigel | Rigel | Beta Orionis | ori | 5.2423 | -8.2016 | 0.13 | B8 | 860 |
| procyon | Procyon | Alpha Canis Minoris | cmi | 7.6550 | 5.2250 | 0.34 | F5 | 11.5 |
| betelgeuse | Betelgeuse | Alpha Orionis | ori | 5.9195 | 7.4071 | 0.42 | M1 | 640 |
| achernar | Achernar | Alpha Eridani | eri | 1.6286 | -57.2368 | 0.46 | B6 | 139 |
| hadar | Hadar | Beta Centauri | cen | 14.0637 | -60.3730 | 0.61 | B1 | 390 |
| altair | Altair | Alpha Aquilae | aql | 19.8464 | 8.8683 | 0.76 | A7 | 16.7 |
| acrux | Acrux | Alpha Crucis | cru | 12.4433 | -63.0991 | 0.77 | B0.5 | 320 |
| aldebaran | Aldebaran | Alpha Tauri | tau | 4.5987 | 16.5093 | 0.86 | K5 | 65.3 |
| spica | Spica | Alpha Virginis | vir | 13.4199 | -11.1613 | 0.97 | B1 | 250 |
| antares | Antares | Alpha Scorpii | sco | 16.4901 | -26.4320 | 1.06 | M1.5 | 550 |
| pollux | Pollux | Beta Geminorum | gem | 7.7553 | 28.0262 | 1.14 | K0 | 33.8 |
| fomalhaut | Fomalhaut | Alpha Piscis Austrini | psa | 22.9608 | -29.6222 | 1.16 | A3 | 25.1 |
| mimosa | Mimosa | Beta Crucis | cru | 12.7954 | -59.6888 | 1.25 | B0.5 | 280 |
| deneb | Deneb | Alpha Cygni | cyg | 20.6905 | 45.2803 | 1.25 | A2 | 2615 |
| regulus | Regulus | Alpha Leonis | leo | 10.1395 | 11.9672 | 1.35 | B7 | 79 |
| adhara | Adhara | Epsilon Canis Majoris | cma | 6.9771 | -28.9721 | 1.50 | B2 | 430 |
| castor | Castor | Alpha Geminorum | gem | 7.5766 | 31.8883 | 1.58 | A1 | 51 |
| gacrux | Gacrux | Gamma Crucis | cru | 12.5194 | -57.1132 | 1.63 | M3.5 | 88 |
| shaula | Shaula | Lambda Scorpii | sco | 17.5601 | -37.1038 | 1.62 | B2 | 570 |
| bellatrix | Bellatrix | Gamma Orionis | ori | 5.4189 | 6.3497 | 1.64 | B2 | 250 |
| elnath | Elnath | Beta Tauri | tau | 5.4382 | 28.6075 | 1.65 | B7 | 134 |
| miaplacidus | Miaplacidus | Beta Carinae | car | 9.2200 | -69.7172 | 1.67 | A1 | 111 |
| alnilam | Alnilam | Epsilon Orionis | ori | 5.6036 | -1.2019 | 1.69 | B0 | 2000 |
| alnitak | Alnitak | Zeta Orionis | ori | 5.6794 | -1.9426 | 1.74 | O9.5 | 1260 |
| alioth | Alioth | Epsilon Ursae Majoris | uma | 12.9003 | 55.9598 | 1.76 | A0 | 82.6 |
| dubhe | Dubhe | Alpha Ursae Majoris | uma | 11.0621 | 61.7510 | 1.79 | K0 | 123 |
| mirfak | Mirfak | Alpha Persei | per | 3.4054 | 49.8612 | 1.79 | F5 | 510 |
| wezen | Wezen | Delta Canis Majoris | cma | 7.1399 | -26.3932 | 1.83 | F8 | 1600 |
| alkaid | Alkaid | Eta Ursae Majoris | uma | 13.7923 | 49.3133 | 1.85 | B3 | 104 |
| polaris | Polaris | Alpha Ursae Minoris | umi | 2.5303 | 89.2641 | 1.98 | F7 | 433 |
| sadr | Sadr | Gamma Cygni | cyg | 20.3705 | 40.2567 | 2.23 | F8 | 1800 |
| avior | Avior | Epsilon Carinae | car | 8.3753 | -59.5095 | 1.86 | K3 | 630 |
| menkalinan | Menkalinan | Beta Aurigae | aur | 5.9921 | 44.9474 | 1.90 | A2 | 81 |
| atrak | Atrak | Alpha Trianguli Australis | tra | 16.8111 | -69.0277 | 1.91 | K2 | 391 |
| algol | Algol | Beta Persei | per | 3.1361 | 40.9556 | 2.12 | B8 | 93 |
| dschubba | Dschubba | Delta Scorpii | sco | 16.0056 | -22.6217 | 2.29 | B0.3 | 400 |
| merak | Merak | Beta Ursae Majoris | uma | 11.0307 | 56.3824 | 2.37 | A1 | 79.7 |
| phecda | Phecda | Gamma Ursae Majoris | uma | 11.8972 | 53.6948 | 2.44 | A0 | 83.2 |
| megrez | Megrez | Delta Ursae Majoris | uma | 12.2571 | 57.0326 | 3.31 | A3 | 80.5 |
| mizar | Mizar | Zeta Ursae Majoris | uma | 13.3987 | 54.9254 | 2.27 | A2 | 82.9 |
| mintaka | Mintaka | Delta Orionis | ori | 5.5334 | -0.2991 | 2.23 | O9.5 | 1200 |
| saiph | Saiph | Kappa Orionis | ori | 5.7959 | -9.6696 | 2.06 | B0.5 | 720 |
| meissa | Meissa | Lambda Orionis | ori | 5.5856 | 9.9342 | 3.39 | O8 | 1100 |
| schedar | Schedar | Alpha Cassiopeiae | cas | 0.6751 | 56.5373 | 2.24 | K0 | 228 |
| caph | Caph | Beta Cassiopeiae | cas | 0.1528 | 59.1498 | 2.28 | F2 | 54.7 |
| tsih | Tsih | Gamma Cassiopeiae | cas | 0.9451 | 60.7167 | 2.15 | B0.5 | 610 |
| ruchbah | Ruchbah | Delta Cassiopeiae | cas | 1.4274 | 60.2353 | 2.68 | A5 | 99 |
| segin | Segin | Epsilon Cassiopeiae | cas | 1.9065 | 63.6701 | 3.35 | B3 | 410 |
| albireo | Albireo | Beta Cygni | cyg | 19.5120 | 27.9597 | 3.08 | K3 | 430 |
| delta-cyg | Fawaris | Delta Cygni | cyg | 19.7496 | 45.1308 | 2.87 | B9 | 170 |
| epsilon-cyg | Aljanah | Epsilon Cygni | cyg | 20.7701 | 33.9703 | 2.48 | K0 | 73 |
| nunki | Nunki | Sigma Sagittarii | sgr | 18.9211 | -26.2967 | 2.05 | B2 | 228 |
| kaus-australis | Kaus Australis | Epsilon Sagittarii | sgr | 18.4029 | -34.3846 | 1.85 | B9.5 | 143 |
| peculum | Peacock | Alpha Pavonis | pav | 20.4275 | -56.7351 | 1.94 | B2 | 180 |
| alpha-cen | Rigil Kentaurus | Alpha Centauri | cen | 14.6601 | -60.8339 | -0.01 | G2 | 4.37 |
| beta-cen | Hadar-dup | Beta Centauri B | cen | 14.0637 | -60.3730 | 0.61 | B1 | 390 |
| delta-cru | Imai | Delta Crucis | cru | 12.2524 | -58.7489 | 2.79 | B2 | 345 |
| thuban | Thuban | Alpha Draconis | dra | 14.0732 | 64.3758 | 3.65 | A0 | 303 |
| rasalhague | Rasalhague | Alpha Ophiuchi | oph | 17.5822 | 12.5600 | 2.08 | A5 | 48.6 |
| enif | Enif | Epsilon Pegasi | peg | 21.7364 | 9.8750 | 2.38 | K2 | 690 |
| markab | Markab | Alpha Pegasi | peg | 23.0793 | 15.2053 | 2.49 | A0 | 133 |
| scheat | Scheat | Beta Pegasi | peg | 23.0626 | 28.0828 | 2.42 | M2 | 196 |
| algedi | Algedi | Alpha Capricorni | cap | 20.2942 | -12.5440 | 3.57 | G3 | 570 |
| denebola | Denebola | Beta Leonis | leo | 11.8177 | 14.5721 | 2.14 | A3 | 35.9 |
| algorab | Algorab | Delta Corvi | crv | 12.4978 | -16.5154 | 2.94 | B9 | 87 |
| algorab-b | Gienah | Gamma Corvi | crv | 12.2634 | -17.5419 | 2.59 | B8 | 154 |
| zubeneschamali | Zubeneschamali | Beta Librae | lib | 15.2827 | -9.3829 | 2.61 | B8 | 185 |
| zubenelgenubi | Zubenelgenubi | Alpha Librae | lib | 14.8479 | -16.0418 | 2.75 | A3 | 77 |

**Всего строк в таблице: 70.** Генератор обязан включить **все 70**.

Примечание: `hadar` и `beta-cen` указывают на один физический объект Beta Centauri — **канон:** оставь **только `hadar`**, а строку `beta-cen` **не копируй в код** (она оставлена в таблице как пояснение дубля). Итого в коде **69** уникальных `id` (или удали `beta-cen` при копировании). Минимальное требование INDEX (≥50) выполняется с запасом.

**Канон для генератора:** копируй все строки **кроме** `beta-cen` → **69 звёзд**.

---

## A.2 Созвездия (метаданные)

| id | abbr | nameLatin | nameKey |
|----|------|-----------|---------|
| uma | UMa | Ursa Major | constellation.uma |
| umi | UMi | Ursa Minor | constellation.umi |
| ori | Ori | Orion | constellation.ori |
| cas | Cas | Cassiopeia | constellation.cas |
| cyg | Cyg | Cygnus | constellation.cyg |
| sco | Sco | Scorpius | constellation.sco |
| cru | Cru | Crux | constellation.cru |
| cma | CMa | Canis Major | constellation.cma |
| cmi | CMi | Canis Minor | constellation.cmi |
| lyr | Lyr | Lyra | constellation.lyr |
| aql | Aql | Aquila | constellation.aql |
| tau | Tau | Taurus | constellation.tau |
| gem | Gem | Gemini | constellation.gem |
| leo | Leo | Leo | constellation.leo |
| vir | Vir | Virgo | constellation.vir |
| boo | Boo | Bootes | constellation.boo |
| aur | Aur | Auriga | constellation.aur |
| per | Per | Perseus | constellation.per |
| cen | Cen | Centaurus | constellation.cen |
| car | Car | Carina | constellation.car |
| eri | Eri | Eridanus | constellation.eri |
| psa | PsA | Piscis Austrinus | constellation.psa |
| sgr | Sgr | Sagittarius | constellation.sgr |
| pav | Pav | Pavo | constellation.pav |
| tra | TrA | Triangulum Australe | constellation.tra |
| dra | Dra | Draco | constellation.dra |
| oph | Oph | Ophiuchus | constellation.oph |
| peg | Peg | Pegasus | constellation.peg |
| cap | Cap | Capricornus | constellation.cap |
| crv | Crv | Corvus | constellation.crv |
| lib | Lib | Libra | constellation.lib |

Для созвездий **без** обязательных линий фигуры допустим `edges: []`, но `starIds` должен включать все звёзды каталога с этим id.  
**Обязательные линии фигуры** — §A.3.

---

## A.3 Constellation edges (обязательные фигуры)

Формат: пары `fromStarId → toStarId`.

### Ursa Major (Big Dipper)
```
dubhe–merak
merak–phecda
phecda–megrez
megrez–alioth
alioth–mizar
mizar–alkaid
megrez–dubhe
```

### Orion
```
betelgeuse–meissa
meissa–bellatrix
bellatrix–mintaka
mintaka–alnilam
alnilam–alnitak
betelgeuse–mintaka
saiph–alnitak
rigel–saiph
rigel–mintaka
bellatrix–betelgeuse
```

### Cassiopeia (W)
```
caph–schedar
schedar–tsih
tsih–ruchbah
ruchbah–segin
```

### Cygnus (Northern Cross)
```
deneb–sadr
sadr–albireo
delta-cyg–sadr
sadr–epsilon-cyg
```

### Scorpius
```
dschubba–antares
antares–shaula
```

### Crux (Southern Cross)
```
acrux–mimosa
mimosa–gacrux
gacrux–delta-cru
delta-cru–acrux
acrux–gacrux
```

### Canis Major (минимум)
```
sirius–adhara
sirius–wezen
```

### Lyra / Aquila (Summer Triangle helpers — опциональные edges внутри своих constellations)
```
# lyr: edges []  (Vega alone OK)
# aql: edges []
```
Summer Triangle **не** обязан быть отдельным Constellation; линии между Vega–Deneb–Altair **не** добавлять как constellation edges (разные constellations).

Каждый `Constellation` с фигурой заполняет `edges` и `starIds` (union узлов).

---

## A.4 Location presets

| id | nameKey | latitudeDeg | longitudeDeg |
|----|---------|-------------|--------------|
| moscow | preset.moscow | 55.7558 | 37.6173 |
| equator | preset.equator | 0 | 0 |
| north-pole | preset.northPole | 90 | 0 |
| south-pole | preset.southPole | -90 | 0 |

Default observer = **moscow**.

---

## A.5 Render / draw constants

Положи в `render.constants.ts`:

| Constant | Value | Notes |
|----------|-------|-------|
| `MAX_DPR` | 2 | |
| `ZOOM_MIN` | 0.75 | |
| `ZOOM_MAX` | 3.0 | |
| `ZOOM_DEFAULT` | 1.0 | |
| `PAN_DEG_PER_PIXEL` | 0.25 | |
| `DOME_RADIUS_FACTOR` | 0.48 | `R = min(w,h) * factor` at zoom=1 mapping |
| `HIT_SLOP_PX` | 8 | |
| `LABEL_MAG_LIMIT` | 1.5 | |
| `MAG_REF` | 0.0 | for radius formula |
| `RADIUS_BASE_PX` | 3.2 | |
| `RADIUS_MIN_PX` | 0.8 | |
| `RADIUS_MAX_PX` | 9.0 | |
| `ALPHA_MIN` | 0.35 | |
| `ALPHA_MAX` | 1.0 | |
| `GRID_ALTITUDES_DEG` | `[0, 30, 60]` | + optional 15/45 thinner |
| `EQUATOR_SAMPLES` | 180 | |
| `CONSTELLATION_LINE_WIDTH` | 1 | |
| `CONSTELLATION_HOVER_LINE_WIDTH` | 2.25 | |

Spectral colors — см. документ 04 / Appendix B §B.6.

---

## A.6 Hotkeys

| Key | Action |
|-----|--------|
| Space | Play / Pause |
| `=` / `+` | Increase speed |
| `-` | Decrease speed |
| `G` | Toggle grid |
| `C` | Toggle constellation lines |
| `L` | Toggle star labels |
| `1` | Preset Moscow |
| `2` | Preset Equator |
| `3` | Preset North Pole |
| `4` | Preset South Pole |
| `T` | Theme toggle |
| `I` | Locale RU↔EN |
| Esc | Clear selection / close mobile sidebar |

---

## A.7 Default time playback

| Field | Value |
|-------|-------|
| playing | `true` |
| speedSimHoursPerRealSec | `1` (hourPerSec) |
| utcMs | `Date.now()` at bootstrap |
| centerAzimuthDeg | `180` |
| showGrid | `true` |
| showConstellationLines | `true` |
| showStarLabels | `false` |
| theme | `dark` |
| locale | `ru` |

---

## A.8 i18n name keys (обязательный минимум)

Для **каждого** `star.id` и `constellation.id` из этого appendix должны существовать ключи в `ru.ts` и `en.ts`:
- `starName.<id>`
- `constellation.<id>`

Плюс UI-ключи из документа 06/07 (`app.title`, `observer.latitude`, `time.play`, …).

---

## A.9 Критерий готовности Appendix A

Все 69 звёзд (без `beta-cen`), все обязательные edges, presets, constants и hotkeys перенесены в код без пропусков.
