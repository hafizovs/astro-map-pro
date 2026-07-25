import type { Constellation, Star, StarId } from '../../models/astronomy.types';
import { CONSTELLATIONS } from './constellations.data';
import { STARS } from './stars.data';

export function buildStarMap(stars: readonly Star[] = STARS): Map<StarId, Star> {
  return new Map(stars.map((s) => [s.id, s]));
}

export function validateConstellationEdges(
  stars: readonly Star[] = STARS,
  constellations: readonly Constellation[] = CONSTELLATIONS,
): string[] {
  const ids = new Set(stars.map((s) => s.id));
  const errors: string[] = [];
  for (const c of constellations) {
    for (const e of c.edges) {
      if (!ids.has(e.fromStarId)) {
        errors.push(`${c.id}: missing fromStarId ${e.fromStarId}`);
      }
      if (!ids.has(e.toStarId)) {
        errors.push(`${c.id}: missing toStarId ${e.toStarId}`);
      }
    }
  }
  return errors;
}

export function getCatalogStars(): readonly Star[] {
  return STARS;
}

export function getCatalogConstellations(): readonly Constellation[] {
  return CONSTELLATIONS;
}

export { STARS, CONSTELLATIONS };
