import { Injectable, signal } from '@angular/core';
import {
  TIME_SPEED_MAX,
  TIME_SPEED_MIN,
  TIME_SPEED_PRESETS,
} from '../core/constants/time.constants';
import { clamp } from '../domain/astronomy/angle.util';

@Injectable({ providedIn: 'root' })
export class TimeStore {
  readonly utcMs = signal(Date.now());
  readonly playing = signal(true);
  readonly speedSimHoursPerRealSec = signal<number>(TIME_SPEED_PRESETS.hourPerSec);

  tick(realDtSec: number): void {
    if (!this.playing()) {
      return;
    }
    const dtMs = realDtSec * this.speedSimHoursPerRealSec() * 3_600_000;
    this.utcMs.update((ms) => ms + dtMs);
  }

  play(): void {
    this.playing.set(true);
  }

  pause(): void {
    this.playing.set(false);
  }

  toggle(): void {
    this.playing.update((p) => !p);
  }

  setSpeed(v: number): void {
    this.speedSimHoursPerRealSec.set(clamp(v, TIME_SPEED_MIN, TIME_SPEED_MAX));
  }

  setNow(): void {
    this.utcMs.set(Date.now());
  }

  setUtcMs(ms: number): void {
    this.utcMs.set(ms);
  }
}
