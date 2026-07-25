import { EPOCH_J2000_JD } from '../../core/constants/astronomy.constants';
import { normalizeDeg, normalizeHours } from './angle.util';
import { julianCenturies, julianDate } from './julian.util';

/** Greenwich Mean Sidereal Time in hours [0, 24) */
export function gmstHoursFromJd(jd: number): number {
  const T = julianCenturies(jd);
  let gmstDeg =
    280.46061837 +
    360.98564736629 * (jd - EPOCH_J2000_JD) +
    0.000387933 * T * T -
    (T * T * T) / 38710000.0;
  gmstDeg = normalizeDeg(gmstDeg);
  return gmstDeg / 15.0;
}

export function gmstHours(utcMs: number): number {
  return gmstHoursFromJd(julianDate(utcMs));
}

/** Local Sidereal Time in hours [0, 24) */
export function lstHours(utcMs: number, longitudeDeg: number): number {
  const lst = gmstHours(utcMs) + longitudeDeg / 15.0;
  return normalizeHours(lst);
}
