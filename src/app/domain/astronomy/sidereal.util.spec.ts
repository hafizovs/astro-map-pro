import { describe, expect, it } from 'vitest';
import { normalizeHours } from './angle.util';
import { gmstHours, lstHours } from './sidereal.util';

describe('sidereal.util', () => {
  it('normalizes hours into [0, 24)', () => {
    expect(normalizeHours(25)).toBe(1);
    expect(normalizeHours(-1)).toBe(23);
  });

  it('returns GMST in [0, 24)', () => {
    const gmst = gmstHours(Date.UTC(2000, 0, 1, 12, 0, 0, 0));
    expect(gmst).toBeGreaterThanOrEqual(0);
    expect(gmst).toBeLessThan(24);
  });

  it('shifts LST by longitude / 15 hours', () => {
    const utcMs = Date.UTC(2024, 5, 21, 0, 0, 0, 0);
    const gmst = gmstHours(utcMs);
    const lst = lstHours(utcMs, 30);
    const expected = normalizeHours(gmst + 30 / 15);
    expect(lst).toBeCloseTo(expected, 10);
  });
});
