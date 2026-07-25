import { DEG_PER_CIRCLE, HOURS_PER_CIRCLE } from '../../core/constants/astronomy.constants';

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function normalizeDeg(deg: number): number {
  let d = deg % DEG_PER_CIRCLE;
  if (d < 0) {
    d += DEG_PER_CIRCLE;
  }
  return d;
}

export function normalizeHours(hours: number): number {
  let h = hours % HOURS_PER_CIRCLE;
  if (h < 0) {
    h += HOURS_PER_CIRCLE;
  }
  return h;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function normalizeLongitude(lon: number): number {
  let l = ((lon + 180) % 360 + 360) % 360 - 180;
  if (l === -180) {
    return 180;
  }
  return l;
}
