import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { AstroMathService } from '../../../sky/astro-math.service';
import { I18nService } from '../../../../core/i18n.service';
import { StarCatalogService } from '../../../sky/star-catalog.service';
import { ObserverStore } from '../../../sky/observer.store';
import { SelectionStore } from '../../../sky/selection.store';
import { TimeStore } from '../../../sky/time.store';

@Component({
  selector: 'amp-star-detail-card',
  standalone: true,
  templateUrl: './star-detail-card.component.html',
  styleUrl: './star-detail-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarDetailCardComponent {
  readonly starId = input.required<string>();

  private readonly catalog = inject(StarCatalogService);
  private readonly math = inject(AstroMathService);
  private readonly observer = inject(ObserverStore);
  private readonly time = inject(TimeStore);
  private readonly selection = inject(SelectionStore);
  readonly i18n = inject(I18nService);

  readonly info = computed(() => {
    const star = this.catalog.getStar(this.starId());
    if (!star) {
      return null;
    }
    const lst = this.math.lstHours(
      this.time.utcMs(),
      this.observer.longitudeDeg(),
    );
    const horizontal = this.math.equatorialToHorizontal(
      star.raHours,
      star.decDeg,
      lst,
      this.observer.latitudeDeg(),
    );
    const constellation = this.catalog.getConstellation(star.constellationId);
    return {
      star,
      horizontal,
      lstHours: lst,
      constellation,
      color: this.math.spectralClassToColor(star.spectralClass),
    };
  });

  t(key: string): string {
    return this.i18n.t(key);
  }

  close(): void {
    this.selection.selectStar(null);
  }

  formatRa(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`;
  }

  formatDec(deg: number): string {
    const sign = deg >= 0 ? '+' : '−';
    const abs = Math.abs(deg);
    const d = Math.floor(abs);
    const m = Math.floor((abs - d) * 60);
    return `${sign}${d}° ${m.toString().padStart(2, '0')}′`;
  }
}
