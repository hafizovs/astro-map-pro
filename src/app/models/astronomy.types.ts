/** Идентификатор звезды (kebab / snake стабильный ключ) */
export type StarId = string;

/** Идентификатор созвездия */
export type ConstellationId = string;

/** Спектральный класс (буква + опциональная цифра/подкласс строкой) */
export type SpectralClass = string;

export type LocationPresetId =
  | 'moscow'
  | 'equator'
  | 'north-pole'
  | 'south-pole';

export interface EquatorialCoordinates {
  /** Right Ascension in decimal hours [0, 24) */
  raHours: number;
  /** Declination in degrees [-90, 90] */
  decDeg: number;
}

export interface HorizontalCoordinates {
  /** Azimuth in degrees: 0 = North, 90 = East, 180 = South, 270 = West */
  azimuthDeg: number;
  /** Altitude above horizon in degrees; 0 = horizon, 90 = zenith */
  altitudeDeg: number;
}

export interface ObserverLocation {
  /** Geographic latitude degrees [-90, 90] */
  latitudeDeg: number;
  /** Geographic longitude degrees [-180, 180]; East positive */
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
  /** Display name key — канон: nameKey + fallback latin */
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

export interface LocationPreset {
  id: LocationPresetId;
  nameKey: string;
  latitudeDeg: number;
  longitudeDeg: number;
}
