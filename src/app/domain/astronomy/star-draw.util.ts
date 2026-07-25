import {
  ALPHA_MAX,
  ALPHA_MIN,
  MAG_REF,
  RADIUS_BASE_PX,
  RADIUS_MAX_PX,
  RADIUS_MIN_PX,
} from '../../core/constants/render.constants';
import { clamp } from './angle.util';

const SPECTRAL_COLORS: Record<string, string> = {
  O: '#9bb0ff',
  B: '#aabfff',
  A: '#cad7ff',
  F: '#f8f7ff',
  G: '#fff4ea',
  K: '#ffd2a1',
  M: '#ffcc6f',
};

export function magnitudeToRadiusPx(magnitude: number, zoom: number): number {
  const raw = RADIUS_BASE_PX * Math.pow(10, -0.2 * (magnitude - MAG_REF)) * zoom;
  return clamp(raw, RADIUS_MIN_PX, RADIUS_MAX_PX);
}

export function magnitudeToAlpha(magnitude: number): number {
  const raw = 1.1 - 0.12 * magnitude;
  return clamp(raw, ALPHA_MIN, ALPHA_MAX);
}

export function spectralClassToColor(spectralClass: string): string {
  const letter = (spectralClass.trim().charAt(0) || '').toUpperCase();
  return SPECTRAL_COLORS[letter] ?? '#e8eefc';
}
