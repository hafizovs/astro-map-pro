import type { LocationPreset } from '../models/astronomy.types';

export const LOCATION_PRESETS: readonly LocationPreset[] = [
  {
    id: 'moscow',
    nameKey: 'preset.moscow',
    latitudeDeg: 55.7558,
    longitudeDeg: 37.6173,
  },
  {
    id: 'equator',
    nameKey: 'preset.equator',
    latitudeDeg: 0,
    longitudeDeg: 0,
  },
  {
    id: 'north-pole',
    nameKey: 'preset.northPole',
    latitudeDeg: 90,
    longitudeDeg: 0,
  },
  {
    id: 'south-pole',
    nameKey: 'preset.southPole',
    latitudeDeg: -90,
    longitudeDeg: 0,
  },
] as const;

export const DEFAULT_LATITUDE_DEG = 55.7558;
export const DEFAULT_LONGITUDE_DEG = 37.6173;
