import { Injectable, inject } from '@angular/core';
import {
  TIME_SPEED_MAX,
  TIME_SPEED_MIN,
} from '../core/constants/time.constants';
import { ObserverStore } from '../state/observer.store';
import { SelectionStore } from '../state/selection.store';
import { SkyUiStore } from '../state/sky-ui.store';
import { TimeStore } from '../state/time.store';
import { I18nService } from './i18n.service';

@Injectable({ providedIn: 'root' })
export class HotkeysService {
  private readonly time = inject(TimeStore);
  private readonly observer = inject(ObserverStore);
  private readonly ui = inject(SkyUiStore);
  private readonly selection = inject(SelectionStore);
  private readonly i18n = inject(I18nService);
  private listening = false;

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) {
      return;
    }

    const key = event.key;
    const lower = key.toLowerCase();

    if (key === ' ' || key === 'Spacebar') {
      event.preventDefault();
      this.time.toggle();
      return;
    }

    if (key === '=' || key === '+') {
      event.preventDefault();
      this.bumpSpeed(1.5);
      return;
    }

    if (key === '-' || key === '_') {
      event.preventDefault();
      this.bumpSpeed(1 / 1.5);
      return;
    }

    if (lower === 'g') {
      event.preventDefault();
      this.ui.toggleGrid();
      return;
    }

    if (lower === 'c') {
      event.preventDefault();
      this.ui.toggleConstellationLines();
      return;
    }

    if (lower === 'l') {
      event.preventDefault();
      this.ui.toggleStarLabels();
      return;
    }

    if (key === '1') {
      event.preventDefault();
      this.observer.applyPreset('moscow');
      return;
    }

    if (key === '2') {
      event.preventDefault();
      this.observer.applyPreset('equator');
      return;
    }

    if (key === '3') {
      event.preventDefault();
      this.observer.applyPreset('north-pole');
      return;
    }

    if (key === '4') {
      event.preventDefault();
      this.observer.applyPreset('south-pole');
      return;
    }

    if (lower === 't') {
      event.preventDefault();
      this.ui.toggleTheme();
      return;
    }

    if (lower === 'i') {
      event.preventDefault();
      this.i18n.toggleLocale();
      return;
    }

    if (key === 'Escape') {
      event.preventDefault();
      if (this.selection.selectedStarId()) {
        this.selection.selectStar(null);
      } else if (window.innerWidth < 900 && this.ui.sidebarOpen()) {
        this.ui.setSidebarOpen(false);
      }
    }
  };

  start(): void {
    if (this.listening) {
      return;
    }
    window.addEventListener('keydown', this.onKeyDown);
    this.listening = true;
  }

  stop(): void {
    if (!this.listening) {
      return;
    }
    window.removeEventListener('keydown', this.onKeyDown);
    this.listening = false;
  }

  private bumpSpeed(factor: number): void {
    const next = Math.min(
      TIME_SPEED_MAX,
      Math.max(TIME_SPEED_MIN, this.time.speedSimHoursPerRealSec() * factor),
    );
    this.time.setSpeed(next);
  }
}
