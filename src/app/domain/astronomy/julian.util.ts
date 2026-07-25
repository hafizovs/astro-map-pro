import { EPOCH_J2000_JD, UNIX_EPOCH_JD } from '../../core/constants/astronomy.constants';

/** UTC milliseconds → Julian Date */
export function julianDate(utcMs: number): number {
  return utcMs / 86_400_000 + UNIX_EPOCH_JD;
}

/** Julian centuries from J2000.0 */
export function julianCenturies(jd: number): number {
  return (jd - EPOCH_J2000_JD) / 36525.0;
}
