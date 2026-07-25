import { Injectable, signal } from '@angular/core';
import type { LocaleId } from '../core/models/locale.model';
import type { ThemeId } from '../core/models/theme.model';

@Injectable({ providedIn: 'root' })
export class SkyUiStore {
  readonly showGrid = signal(true);
  readonly showConstellationLines = signal(true);
  readonly showStarLabels = signal(false);
  readonly theme = signal<ThemeId>('dark');
  readonly locale = signal<LocaleId>('ru');
  readonly sidebarOpen = signal(true);

  toggleGrid(): void {
    this.showGrid.update((v) => !v);
  }

  toggleConstellationLines(): void {
    this.showConstellationLines.update((v) => !v);
  }

  toggleStarLabels(): void {
    this.showStarLabels.update((v) => !v);
  }

  toggleTheme(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  setTheme(theme: ThemeId): void {
    this.theme.set(theme);
  }

  toggleLocale(): void {
    this.locale.update((l) => (l === 'ru' ? 'en' : 'ru'));
  }

  setLocale(locale: LocaleId): void {
    this.locale.set(locale);
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  setSidebarOpen(open: boolean): void {
    this.sidebarOpen.set(open);
  }
}
