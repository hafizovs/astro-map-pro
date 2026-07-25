import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LOCATION_PRESETS } from '../../core/constants/location-presets.constants';
import type { LocationPresetId } from '../../models/astronomy.types';
import { AstroMathService } from '../../services/astro-math.service';
import { I18nService } from '../../services/i18n.service';
import { ObserverStore } from '../../state/observer.store';
import { SkyUiStore } from '../../state/sky-ui.store';
import { TimeStore } from '../../state/time.store';

@Component({
  selector: 'amp-observer-panel',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './observer-panel.component.html',
  styleUrl: './observer-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObserverPanelComponent {
  readonly observer = inject(ObserverStore);
  readonly ui = inject(SkyUiStore);
  readonly time = inject(TimeStore);
  readonly i18n = inject(I18nService);
  private readonly math = inject(AstroMathService);

  readonly presets = LOCATION_PRESETS;

  readonly lstText = computed(() => {
    const lst = this.math.lstHours(
      this.time.utcMs(),
      this.observer.longitudeDeg(),
    );
    return formatSidereal(lst);
  });

  onLatInput(value: string): void {
    this.observer.setLatitude(Number(value));
  }

  onLonInput(value: string): void {
    this.observer.setLongitude(Number(value));
  }

  applyPreset(id: LocationPresetId): void {
    this.observer.applyPreset(id);
  }

  t(key: string): string {
    return this.i18n.t(key);
  }
}

function formatSidereal(hours: number): string {
  const h = Math.floor(hours) % 24;
  const mFloat = (hours - Math.floor(hours)) * 60;
  const m = Math.floor(mFloat) % 60;
  const s = Math.floor((mFloat - Math.floor(mFloat)) * 60) % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}
