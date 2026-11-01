import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
} from '@angular/core';
import { ObserverPanelComponent } from '../../../features/observer/components/observer-panel/observer-panel.component';
import { SkyCanvasComponent } from '../../../features/sky/components/sky-canvas/sky-canvas.component';
import { StarDetailCardComponent } from '../../../features/observer/components/star-detail-card/star-detail-card.component';
import { TimePlayerComponent } from '../time-player/time-player.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { HotkeysService } from '../../hotkeys.service';
import { I18nService } from '../../i18n.service';
import { SelectionStore } from '../../../features/sky/selection.store';
import { SkyUiStore } from '../../../features/sky/sky-ui.store';

@Component({
  selector: 'amp-telescope-dashboard',
  standalone: true,
  imports: [
    ToolbarComponent,
    SkyCanvasComponent,
    ObserverPanelComponent,
    StarDetailCardComponent,
    TimePlayerComponent,
  ],
  templateUrl: './telescope-dashboard.component.html',
  styleUrl: './telescope-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TelescopeDashboardComponent {
  readonly ui = inject(SkyUiStore);
  readonly selection = inject(SelectionStore);
  private readonly hotkeys = inject(HotkeysService);
  private readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 899px)').matches) {
      this.ui.setSidebarOpen(false);
    }

    this.hotkeys.start();
    this.destroyRef.onDestroy(() => this.hotkeys.stop());

    effect(() => {
      document.documentElement.dataset['theme'] = this.ui.theme();
    });
  }

  t(key: string): string {
    return this.i18n.t(key);
  }
}
