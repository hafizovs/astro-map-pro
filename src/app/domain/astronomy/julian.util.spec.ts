import { describe, expect, it } from 'vitest';
import { EPOCH_J2000_JD } from '../../core/constants/astronomy.constants';
import { julianCenturies, julianDate } from './julian.util';

describe('julian.util', () => {
  it('maps UTC 2000-01-01T12:00:00.000Z to JD 2451545.0', () => {
    const utcMs = Date.UTC(2000, 0, 1, 12, 0, 0, 0);
    expect(julianDate(utcMs)).toBeCloseTo(EPOCH_J2000_JD, 8);
  });

  it('returns zero Julian centuries at J2000.0', () => {
    expect(julianCenturies(EPOCH_J2000_JD)).toBeCloseTo(0, 12);
  });
});
