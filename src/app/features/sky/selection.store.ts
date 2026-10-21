import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SelectionStore {
  readonly selectedStarId = signal<string | null>(null);
  readonly hoveredConstellationId = signal<string | null>(null);

  selectStar(id: string | null): void {
    this.selectedStarId.set(id);
  }

  setHoveredConstellation(id: string | null): void {
    this.hoveredConstellationId.set(id);
  }

  clear(): void {
    this.selectedStarId.set(null);
    this.hoveredConstellationId.set(null);
  }
}
