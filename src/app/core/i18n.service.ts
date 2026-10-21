import { Injectable, computed, inject } from '@angular/core';
import type { LocaleId } from './models/locale.model';
import { EN_DICTIONARY } from './i18n/dictionaries/en';
import { RU_DICTIONARY } from './i18n/dictionaries/ru';
import { SkyUiStore } from '../features/sky/sky-ui.store';

const DICTIONARIES: Record<LocaleId, Record<string, string>> = {
  ru: RU_DICTIONARY,
  en: EN_DICTIONARY,
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly ui = inject(SkyUiStore);

  readonly locale = computed(() => this.ui.locale());

  t(key: string): string {
    const dict = DICTIONARIES[this.ui.locale()];
    return dict[key] ?? EN_DICTIONARY[key] ?? key;
  }

  toggleLocale(): void {
    this.ui.toggleLocale();
  }

  setLocale(locale: LocaleId): void {
    this.ui.setLocale(locale);
  }
}
