import { describe, expect, it } from 'vitest';
import { STARS } from '../catalog/stars.data';
import { equatorialToHorizontal } from './coordinates.util';

describe('coordinates.util', () => {
  it('places Polaris near zenith at the north pole', () => {
    const polaris = STARS.find((s) => s.id === 'polaris');
    expect(polaris).toBeTruthy();
    const hor = equatorialToHorizontal(
      polaris!.raHours,
      polaris!.decDeg,
      12,
      90,
    );
    expect(Math.abs(hor.altitudeDeg - polaris!.decDeg)).toBeLessThan(1);
  });

  it('gives ~90° altitude for equator transit of a Dec=0 star', () => {
    const hor = equatorialToHorizontal(5, 0, 5, 0);
    expect(hor.altitudeDeg).toBeCloseTo(90, 5);
  });

  it('keeps Acrux below the horizon from Moscow for any LST', () => {
    const acrux = STARS.find((s) => s.id === 'acrux');
    expect(acrux).toBeTruthy();
    let maxAlt = -Infinity;
    for (let lst = 0; lst < 24; lst += 0.5) {
      const hor = equatorialToHorizontal(
        acrux!.raHours,
        acrux!.decDeg,
        lst,
        55.7558,
      );
      maxAlt = Math.max(maxAlt, hor.altitudeDeg);
    }
    expect(maxAlt).toBeLessThan(0);
  });
});
