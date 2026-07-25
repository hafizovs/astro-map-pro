import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import {
  TIME_SPEED_MAX,
  TIME_SPEED_MIN,
  TIME_SPEED_PRESETS,
} from '../../core/constants/time.constants';
import { I18nService } from '../../services/i18n.service';
import { TimeStore } from '../../state/time.store';

@Component({
  selector: 'amp-time-player',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './time-player.component.html',
  styleUrl: './time-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimePlayerComponent {
  readonly time = inject(TimeStore);
  readonly i18n = inject(I18nService);

  readonly presets = TIME_SPEED_PRESETS;
  readonly speedMax = Math.log10(TIME_SPEED_MAX);
  readonly speedMinLog = Math.log10(TIME_SPEED_MIN);

  readonly utcText = computed(() => {
    const d = new Date(this.time.utcMs());
    return d.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
  });

  readonly playLabel = computed(() =>
    this.time.playing() ? this.i18n.t('time.pause') : this.i18n.t('time.play'),
  );

  readonly speedLog = computed(() => Math.log10(this.time.speedSimHoursPerRealSec()));

  t(key: string): string {
    return this.i18n.t(key);
  }

  onSpeedLogInput(value: string): void {
    const log = Number(value);
    this.time.setSpeed(Math.pow(10, log));
  }

  setPreset(hoursPerSec: number): void {
    this.time.setSpeed(hoursPerSec);
  }
}
