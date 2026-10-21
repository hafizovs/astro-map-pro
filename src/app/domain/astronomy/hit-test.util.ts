import { HIT_SLOP_PX } from '../../core/constants/render.constants';
import type { Constellation, ProjectedStar, Star } from '../../core/models/astronomy.types';

function distToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1e-12) {
    return Math.hypot(px - x1, py - y1);
  }
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const sx = x1 + t * dx;
  const sy = y1 + t * dy;
  return Math.hypot(px - sx, py - sy);
}

export function findStarAtPointer(
  projected: readonly ProjectedStar[],
  x: number,
  y: number,
  hitSlopPx: number = HIT_SLOP_PX,
): Star | null {
  let best: Star | null = null;
  let bestDist = Number.POSITIVE_INFINITY;

  for (const p of projected) {
    if (!p.screen.visible) {
      continue;
    }
    const d = Math.hypot(p.screen.x - x, p.screen.y - y);
    const limit = Math.max(p.radiusPx, hitSlopPx);
    if (d <= limit && d < bestDist) {
      bestDist = d;
      best = p.star;
    }
  }

  return best;
}

export function findConstellationAtPointer(
  projected: readonly ProjectedStar[],
  constellations: readonly Constellation[],
  x: number,
  y: number,
  hitSlopPx: number = HIT_SLOP_PX,
): Constellation | null {
  const star = findStarAtPointer(projected, x, y, hitSlopPx);
  if (star) {
    return constellations.find((c) => c.id === star.constellationId) ?? null;
  }

  const byId = new Map(projected.map((p) => [p.star.id, p]));
  let best: Constellation | null = null;
  let bestDist = Number.POSITIVE_INFINITY;

  for (const c of constellations) {
    for (const edge of c.edges) {
      const p1 = byId.get(edge.fromStarId);
      const p2 = byId.get(edge.toStarId);
      if (!p1?.screen.visible || !p2?.screen.visible) {
        continue;
      }
      const d = distToSegment(
        x,
        y,
        p1.screen.x,
        p1.screen.y,
        p2.screen.x,
        p2.screen.y,
      );
      if (d <= hitSlopPx && d < bestDist) {
        bestDist = d;
        best = c;
      }
    }
  }

  return best;
}
