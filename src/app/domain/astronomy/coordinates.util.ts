import type { HorizontalCoordinates } from '../../core/models/astronomy.types';
import { clamp, degToRad, normalizeDeg, normalizeHours, radToDeg } from './angle.util';

/**
 * Equatorial (RA, Dec) → Horizontal (az, alt).
 * Azimuth canon: 0 = North, 90 = East.
 */
export function equatorialToHorizontal(
  raHours: number,
  decDeg: number,
  lstHoursValue: number,
  latitudeDeg: number,
): HorizontalCoordinates {
  const HAh = normalizeHours(lstHoursValue - raHours);
  const H = degToRad(HAh * 15);
  const dec = degToRad(decDeg);
  const lat = degToRad(latitudeDeg);

  const sinAlt = clamp(
    Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(H),
    -1,
    1,
  );
  const alt = Math.asin(sinAlt);
  const cosAlt = Math.cos(alt);

  let az = 0;
  if (Math.abs(cosAlt) >= 1e-12 && Math.abs(Math.cos(lat)) >= 1e-12) {
    const sinAz = (-Math.cos(dec) * Math.sin(H)) / cosAlt;
    const cosAz =
      (Math.sin(dec) - Math.sin(alt) * Math.sin(lat)) / (cosAlt * Math.cos(lat));
    az = normalizeDeg(radToDeg(Math.atan2(sinAz, cosAz)));
  }

  return {
    azimuthDeg: az,
    altitudeDeg: radToDeg(alt),
  };
}
