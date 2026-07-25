import { DOME_RADIUS_FACTOR } from '../../core/constants/render.constants';
import type { CameraState, HorizontalCoordinates, ScreenPoint } from '../../models/astronomy.types';
import { degToRad } from './angle.util';

/** Dome radius in pixels for given canvas size and zoom. */
export function domeRadiusPx(
  canvasWidth: number,
  canvasHeight: number,
  zoom: number,
): number {
  return Math.min(canvasWidth, canvasHeight) * DOME_RADIUS_FACTOR * zoom;
}

/** Stereographic radius in projection units for altitude (horizon → 1). */
export function stereographicRadius(altitudeDeg: number): number {
  const z = 90 - altitudeDeg;
  return Math.tan(degToRad(z / 2));
}

/**
 * Stereographic projection of horizontal coords onto canvas.
 * Zenith → center; horizon → circle of radius R.
 */
export function projectHorizontalToCanvas(
  horizontal: HorizontalCoordinates,
  camera: CameraState,
  canvasWidth: number,
  canvasHeight: number,
): ScreenPoint {
  if (horizontal.altitudeDeg < 0) {
    return { x: 0, y: 0, visible: false };
  }

  const r = stereographicRadius(horizontal.altitudeDeg);
  const R = domeRadiusPx(canvasWidth, canvasHeight, camera.zoom);
  const scale = R;
  const psi = degToRad(horizontal.azimuthDeg - camera.centerAzimuthDeg);

  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;
  const x = cx + scale * r * Math.sin(psi);
  const y = cy - scale * r * Math.cos(psi);

  return { x, y, visible: true };
}
