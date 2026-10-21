import { Injectable, signal } from '@angular/core';
import {
  DEFAULT_LATITUDE_DEG,
  DEFAULT_LONGITUDE_DEG,
  LOCATION_PRESETS,
} from '../../core/constants/location-presets.constants';
import { clamp, normalizeLongitude } from '../../domain/astronomy/angle.util';
import type { LocationPresetId } from '../../core/models/astronomy.types';

@Injectable({ providedIn: 'root' })
export class ObserverStore {
  readonly latitudeDeg = signal(DEFAULT_LATITUDE_DEG);
  readonly longitudeDeg = signal(DEFAULT_LONGITUDE_DEG);

  setLatitude(v: number): void {
    this.latitudeDeg.set(clamp(v, -90, 90));
  }

  setLongitude(v: number): void {
    this.longitudeDeg.set(normalizeLongitude(v));
  }

  applyPreset(id: LocationPresetId): void {
    const preset = LOCATION_PRESETS.find((p) => p.id === id);
    if (!preset) {
      return;
    }
    this.latitudeDeg.set(preset.latitudeDeg);
    this.longitudeDeg.set(preset.longitudeDeg);
  }
}
