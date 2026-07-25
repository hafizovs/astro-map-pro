import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
} from '@angular/core';
import { ObserverPanelComponent } from '../observer-panel/observer-panel.component';
import { SkyCanvasComponent } from '../sky-canvas/sky-canvas.component';
import { StarDetailCardComponent } from '../star-detail-card/star-detail-card.component';
import { TimePlayerComponent } from '../time-player/time-player.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { HotkeysService } from '../../services/hotkeys.service';
import { SelectionStore } from '../../state/selection.store';
import { SkyUiStore } from '../../state/sky-ui.store';

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
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.hotkeys.start();
    this.destroyRef.onDestroy(() => this.hotkeys.stop());

    effect(() => {
      document.documentElement.dataset['theme'] = this.ui.theme();
    });
  }
}
