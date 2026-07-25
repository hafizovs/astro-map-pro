import { describe, expect, it } from 'vitest';
import {
  domeRadiusPx,
  projectHorizontalToCanvas,
} from './stereographic.util';

describe('stereographic.util', () => {
  const camera = { centerAzimuthDeg: 180, zoom: 1 };
  const width = 800;
  const height = 600;

  it('maps zenith to canvas center', () => {
    const pt = projectHorizontalToCanvas(
      { azimuthDeg: 0, altitudeDeg: 90 },
      camera,
      width,
      height,
    );
    expect(pt.visible).toBe(true);
    expect(pt.x).toBeCloseTo(width / 2, 6);
    expect(pt.y).toBeCloseTo(height / 2, 6);
  });

  it('maps horizon points onto the dome rim (±2px)', () => {
    const R = domeRadiusPx(width, height, camera.zoom);
    const pt = projectHorizontalToCanvas(
      { azimuthDeg: 90, altitudeDeg: 0 },
      camera,
      width,
      height,
    );
    expect(pt.visible).toBe(true);
    const dist = Math.hypot(pt.x - width / 2, pt.y - height / 2);
    expect(Math.abs(dist - R)).toBeLessThanOrEqual(2);
  });

  it('marks below-horizon points as invisible', () => {
    const pt = projectHorizontalToCanvas(
      { azimuthDeg: 10, altitudeDeg: -5 },
      camera,
      width,
      height,
    );
    expect(pt.visible).toBe(false);
  });
});
