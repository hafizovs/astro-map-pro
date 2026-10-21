import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { MAX_DPR } from '../../../../core/constants/render.constants';
import { AstroMathService } from '../../astro-math.service';
import { I18nService } from '../../../../core/i18n.service';
import { StarCatalogService } from '../../star-catalog.service';
import { CameraStore } from '../../camera.store';
import { ObserverStore } from '../../observer.store';
import { SelectionStore } from '../../selection.store';
import { SkyUiStore } from '../../sky-ui.store';
import { TimeStore } from '../../time.store';
import { SkyPointerController } from './sky-pointer.controller';
import { SkyRenderer } from './sky-renderer';

@Component({
  selector: 'amp-sky-canvas',
  standalone: true,
  templateUrl: './sky-canvas.component.html',
  styleUrl: './sky-canvas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('skyCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly math = inject(AstroMathService);
  private readonly catalog = inject(StarCatalogService);
  private readonly observer = inject(ObserverStore);
  private readonly time = inject(TimeStore);
  private readonly camera = inject(CameraStore);
  private readonly ui = inject(SkyUiStore);
  private readonly selection = inject(SelectionStore);
  private readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);

  readonly ariaLabel = 'AstroMap Pro sky dome';

  private renderer = new SkyRenderer(this.math);
  private pointer: SkyPointerController | null = null;
  private detachPointer: (() => void) | null = null;
  private rafId = 0;
  private lastTs = 0;
  private resizeObserver: ResizeObserver | null = null;
  private cssWidth = 0;
  private cssHeight = 0;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.pointer = new SkyPointerController(
      this.camera,
      this.selection,
      this.math,
      () => this.renderer.getProjected(),
      () => this.catalog.constellations,
      (cursor) => {
        canvas.style.cursor = cursor;
      },
    );
    this.detachPointer = this.pointer.attach(canvas);

    this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
    this.resizeObserver.observe(canvas.parentElement ?? canvas);
    this.resizeCanvas();

    this.lastTs = performance.now();
    const loop = (ts: number): void => {
      const dt = Math.min(0.1, (ts - this.lastTs) / 1000);
      this.lastTs = ts;
      this.time.tick(dt);
      this.paint();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);

    this.destroyRef.onDestroy(() => this.cleanup());
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private cleanup(): void {
    cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
    this.detachPointer?.();
    this.detachPointer = null;
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement ?? canvas;
    const rect = parent.getBoundingClientRect();
    this.cssWidth = Math.max(0, Math.floor(rect.width));
    this.cssHeight = Math.max(0, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.floor(this.cssWidth * dpr);
    canvas.height = Math.floor(this.cssHeight * dpr);
    canvas.style.width = `${this.cssWidth}px`;
    canvas.style.height = `${this.cssHeight}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  private paint(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx || this.cssWidth <= 0 || this.cssHeight <= 0) {
      return;
    }

    const hoveredId = this.selection.hoveredConstellationId();
    const hovered = hoveredId
      ? this.catalog.getConstellation(hoveredId)
      : undefined;

    this.renderer.draw(ctx, this.catalog.stars, this.catalog.constellations, {
      width: this.cssWidth,
      height: this.cssHeight,
      observer: {
        latitudeDeg: this.observer.latitudeDeg(),
        longitudeDeg: this.observer.longitudeDeg(),
      },
      utcMs: this.time.utcMs(),
      camera: {
        centerAzimuthDeg: this.camera.centerAzimuthDeg(),
        zoom: this.camera.zoom(),
      },
      showGrid: this.ui.showGrid(),
      showConstellationLines: this.ui.showConstellationLines(),
      showStarLabels: this.ui.showStarLabels(),
      hoveredConstellationId: hoveredId,
      selectedStarId: this.selection.selectedStarId(),
      constellationLabel: hovered
        ? this.i18n.t(hovered.nameKey)
        : null,
      labelForStar: (starId, latin) => {
        const star = this.catalog.getStar(starId);
        if (!star) {
          return latin;
        }
        const translated = this.i18n.t(star.nameKey);
        return translated === star.nameKey ? latin : translated;
      },
    });
  }
}
