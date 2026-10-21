import {
  DRAG_THRESHOLD_PX,
  HIT_SLOP_PX,
  POINTER_CONSTELLATION_SLOP_PX,
  ZOOM_MAX,
  ZOOM_MIN,
} from '../../../../core/constants/render.constants';
import { clamp } from '../../../../domain/astronomy/angle.util';
import type { AstroMathService } from '../../astro-math.service';
import type { ProjectedStar, Constellation } from '../../../../core/models/astronomy.types';
import type { CameraStore } from '../../camera.store';
import type { SelectionStore } from '../../selection.store';

export class SkyPointerController {
  private dragging = false;
  private pointerId: number | null = null;
  private startX = 0;
  private startY = 0;
  private lastX = 0;
  private lastY = 0;
  private moved = false;

  constructor(
    private readonly camera: CameraStore,
    private readonly selection: SelectionStore,
    private readonly math: AstroMathService,
    private readonly getProjected: () => readonly ProjectedStar[],
    private readonly getConstellations: () => readonly Constellation[],
    private readonly setCursor: (cursor: string) => void,
  ) {}

  attach(canvas: HTMLCanvasElement): () => void {
    const onPointerDown = (e: PointerEvent): void => {
      this.dragging = true;
      this.pointerId = e.pointerId;
      this.startX = e.offsetX;
      this.startY = e.offsetY;
      this.lastX = e.offsetX;
      this.lastY = e.offsetY;
      this.moved = false;
      canvas.setPointerCapture(e.pointerId);
      this.setCursor('grabbing');
    };

    const onPointerMove = (e: PointerEvent): void => {
      const projected = this.getProjected();
      if (this.dragging && this.pointerId === e.pointerId) {
        const dx = e.offsetX - this.lastX;
        const dy = e.offsetY - this.lastY;
        this.lastX = e.offsetX;
        this.lastY = e.offsetY;
        if (
          Math.hypot(e.offsetX - this.startX, e.offsetY - this.startY) >
          DRAG_THRESHOLD_PX
        ) {
          this.moved = true;
        }
        this.camera.panByPixels(dx, dy, 1);
        return;
      }

      const star = this.math.findStarAtPointer(
        projected,
        e.offsetX,
        e.offsetY,
        HIT_SLOP_PX,
      );
      const constellation = this.math.findConstellationAtPointer(
        projected,
        this.getConstellations(),
        e.offsetX,
        e.offsetY,
        POINTER_CONSTELLATION_SLOP_PX,
      );
      this.selection.setHoveredConstellation(constellation?.id ?? null);
      this.setCursor(star ? 'pointer' : 'grab');
    };

    const onPointerUp = (e: PointerEvent): void => {
      if (this.pointerId !== e.pointerId) {
        return;
      }
      const wasDrag = this.moved;
      this.dragging = false;
      this.pointerId = null;
      this.setCursor('grab');
      if (!wasDrag) {
        const star = this.math.findStarAtPointer(
          this.getProjected(),
          e.offsetX,
          e.offsetY,
          HIT_SLOP_PX,
        );
        this.selection.selectStar(star?.id ?? null);
      }
    };

    const onPointerLeave = (): void => {
      if (!this.dragging) {
        this.selection.setHoveredConstellation(null);
        this.setCursor('grab');
      }
    };

    const onWheel = (e: WheelEvent): void => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.92 : 1.08;
      this.camera.setZoom(clamp(this.camera.zoom() * factor, ZOOM_MIN, ZOOM_MAX));
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('wheel', onWheel);
    };
  }
}
