import { Injectable, signal } from '@angular/core';
import {
  PAN_DEG_PER_PIXEL,
  ZOOM_DEFAULT,
  ZOOM_MAX,
  ZOOM_MIN,
} from '../../core/constants/render.constants';
import { clamp, normalizeDeg } from '../../domain/astronomy/angle.util';

@Injectable({ providedIn: 'root' })
export class CameraStore {
  readonly centerAzimuthDeg = signal(180);
  readonly zoom = signal(ZOOM_DEFAULT);

  setCenterAzimuth(v: number): void {
    this.centerAzimuthDeg.set(normalizeDeg(v));
  }

  setZoom(v: number): void {
    this.zoom.set(clamp(v, ZOOM_MIN, ZOOM_MAX));
  }

  panByPixels(dx: number, _dy: number, _canvasRadius: number): void {
    this.centerAzimuthDeg.update((az) => normalizeDeg(az - dx * PAN_DEG_PER_PIXEL));
  }
}
