import { Injectable } from '@angular/core';
import {
  buildStarMap,
  getCatalogConstellations,
  getCatalogStars,
  validateConstellationEdges,
} from '../../domain/catalog/star-catalog';
import type { Constellation, Star, StarId } from '../../core/models/astronomy.types';

@Injectable({ providedIn: 'root' })
export class StarCatalogService {
  readonly stars: readonly Star[] = getCatalogStars();
  readonly constellations: readonly Constellation[] = getCatalogConstellations();

  private readonly starById = buildStarMap(this.stars);
  private readonly constellationById = new Map(
    this.constellations.map((c) => [c.id, c]),
  );

  constructor() {
    const errors = validateConstellationEdges(this.stars, this.constellations);
    if (errors.length > 0) {
      throw new Error(`Invalid constellation edges:\n${errors.join('\n')}`);
    }
  }

  getStar(id: StarId): Star | undefined {
    return this.starById.get(id);
  }

  getConstellation(id: string): Constellation | undefined {
    return this.constellationById.get(id);
  }
}
