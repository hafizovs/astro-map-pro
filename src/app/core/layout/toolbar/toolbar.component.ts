import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LOCATION_PRESETS } from '../../constants/location-presets.constants';
import type { LocationPresetId } from '../../models/astronomy.types';
import { I18nService } from '../../i18n.service';
import { ObserverStore } from '../../../features/sky/observer.store';
import { SkyUiStore } from '../../../features/sky/sky-ui.store';

@Component({
  selector: 'amp-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  readonly ui = inject(SkyUiStore);
  readonly i18n = inject(I18nService);
  readonly observer = inject(ObserverStore);
  readonly presets = LOCATION_PRESETS;

  readonly themeLabel = computed(() => this.i18n.t('toolbar.theme'));
  readonly langLabel = computed(() =>
    this.ui.locale() === 'ru' ? 'EN' : 'RU',
  );

  t(key: string): string {
    return this.i18n.t(key);
  }

  applyPreset(id: LocationPresetId): void {
    this.observer.applyPreset(id);
  }
}
