import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TelescopeDashboardComponent } from './components/telescope-dashboard/telescope-dashboard.component';

@Component({
  selector: 'amp-root',
  standalone: true,
  imports: [TelescopeDashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
