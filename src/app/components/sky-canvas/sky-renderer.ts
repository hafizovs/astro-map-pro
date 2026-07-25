import {
  CONSTELLATION_HOVER_LINE_WIDTH,
  CONSTELLATION_LINE_WIDTH,
  EQUATOR_SAMPLES,
  GLOW_MAG_LIMIT,
  GRID_ALTITUDES_DEG,
  GRID_ALTITUDES_THIN_DEG,
  LABEL_MAG_LIMIT,
} from '../../core/constants/render.constants';
import type { AstroMathService } from '../../services/astro-math.service';
import type {
  CameraState,
  Constellation,
  ObserverLocation,
  ProjectedStar,
} from '../../models/astronomy.types';
import { domeRadiusPx, stereographicRadius } from '../../domain/astronomy/stereographic.util';

export interface SkyRenderFrame {
  width: number;
  height: number;
  observer: ObserverLocation;
  utcMs: number;
  camera: CameraState;
  showGrid: boolean;
  showConstellationLines: boolean;
  showStarLabels: boolean;
  hoveredConstellationId: string | null;
  selectedStarId: string | null;
  constellationLabel?: string | null;
  labelForStar: (starId: string, latin: string) => string;
}

export class SkyRenderer {
  private readonly projected: ProjectedStar[] = [];
  private readonly labelWidthCache = new Map<string, number>();

  constructor(private readonly math: AstroMathService) {}

  getProjected(): readonly ProjectedStar[] {
    return this.projected;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    stars: readonly import('../../models/astronomy.types').Star[],
    constellations: readonly Constellation[],
    frame: SkyRenderFrame,
  ): void {
    const { width, height } = frame;
    if (width <= 0 || height <= 0) {
      return;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = getCssVar('--amp-bg-deep', '#05070d');
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const R = domeRadiusPx(width, height, frame.camera.zoom);

    this.math.projectAllStars(
      stars,
      frame.observer,
      frame.utcMs,
      frame.camera,
      width,
      height,
      this.projected,
    );

    this.drawDomeBackground(ctx, cx, cy, R);
    this.drawHorizonRing(ctx, cx, cy, R);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();

    if (frame.showGrid) {
      this.drawAltitudeGrid(ctx, cx, cy, R, frame.camera.zoom);
      this.drawMeridian(ctx, frame, width, height);
      this.drawEquator(ctx, frame, width, height);
    }

    if (frame.showConstellationLines) {
      this.drawConstellations(ctx, constellations, frame.hoveredConstellationId);
    }

    this.drawStars(ctx, frame.selectedStarId);

    if (frame.showStarLabels) {
      this.drawLabels(ctx, frame);
    }

    if (frame.hoveredConstellationId && frame.constellationLabel) {
      this.drawHoverConstellationLabel(ctx, constellations, frame);
    }

    ctx.restore();
  }

  private drawDomeBackground(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    R: number,
  ): void {
    const grad = ctx.createRadialGradient(cx, cy, R * 0.05, cx, cy, R);
    grad.addColorStop(0, '#0a1020');
    grad.addColorStop(0.55, '#070b16');
    grad.addColorStop(1, '#05070d');
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  private drawHorizonRing(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    R: number,
  ): void {
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = getCssVar('--amp-horizon-ring', 'rgba(232, 238, 252, 0.45)');
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  private drawAltitudeGrid(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    R: number,
    zoom: number,
  ): void {
    const color = getCssVar('--amp-grid', 'rgba(94, 200, 255, 0.18)');
    for (const alt of GRID_ALTITUDES_DEG) {
      const r = stereographicRadius(alt) * R;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = alt === 0 ? 1.25 : 1;
      ctx.globalAlpha = alt === 0 ? 0.9 : 0.7;
      ctx.stroke();
    }
    for (const alt of GRID_ALTITUDES_THIN_DEG) {
      const r = stereographicRadius(alt) * R;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = 0.35;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    void zoom;
  }

  private drawMeridian(
    ctx: CanvasRenderingContext2D,
    frame: SkyRenderFrame,
    width: number,
    height: number,
  ): void {
    const color = getCssVar('--amp-grid', 'rgba(94, 200, 255, 0.18)');
    for (const az of [0, 180]) {
      ctx.beginPath();
      let started = false;
      for (let alt = 0; alt <= 90; alt += 2) {
        const pt = this.math.projectHorizontalToCanvas(
          { azimuthDeg: az, altitudeDeg: alt },
          frame.camera,
          width,
          height,
        );
        if (!pt.visible) {
          started = false;
          continue;
        }
        if (!started) {
          ctx.moveTo(pt.x, pt.y);
          started = true;
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.9;
      ctx.globalAlpha = 0.55;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  private drawEquator(
    ctx: CanvasRenderingContext2D,
    frame: SkyRenderFrame,
    width: number,
    height: number,
  ): void {
    const color = getCssVar('--amp-grid', 'rgba(94, 200, 255, 0.18)');
    const lst = this.math.lstHours(frame.utcMs, frame.observer.longitudeDeg);
    ctx.beginPath();
    let started = false;
    for (let i = 0; i <= EQUATOR_SAMPLES; i++) {
      const raHours = (i / EQUATOR_SAMPLES) * 24;
      const hor = this.math.equatorialToHorizontal(
        raHours,
        0,
        lst,
        frame.observer.latitudeDeg,
      );
      const pt = this.math.projectHorizontalToCanvas(hor, frame.camera, width, height);
      if (!pt.visible || hor.altitudeDeg < 0) {
        started = false;
        continue;
      }
      if (!started) {
        ctx.moveTo(pt.x, pt.y);
        started = true;
      } else {
        ctx.lineTo(pt.x, pt.y);
      }
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.1;
    ctx.globalAlpha = 0.75;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  private drawConstellations(
    ctx: CanvasRenderingContext2D,
    constellations: readonly Constellation[],
    hoveredId: string | null,
  ): void {
    const byId = new Map(this.projected.map((p) => [p.star.id, p]));
    const base = getCssVar('--amp-constellation', 'rgba(180, 200, 255, 0.35)');
    const hover = getCssVar('--amp-constellation-hover', 'rgba(255, 220, 140, 0.85)');

    for (const c of constellations) {
      const isHover = c.id === hoveredId;
      ctx.strokeStyle = isHover ? hover : base;
      ctx.lineWidth = isHover
        ? CONSTELLATION_HOVER_LINE_WIDTH
        : CONSTELLATION_LINE_WIDTH;
      ctx.lineCap = 'round';
      ctx.globalAlpha = isHover ? 1 : 0.9;
      for (const edge of c.edges) {
        const a = byId.get(edge.fromStarId);
        const b = byId.get(edge.toStarId);
        if (!a?.screen.visible || !b?.screen.visible) {
          continue;
        }
        ctx.beginPath();
        ctx.moveTo(a.screen.x, a.screen.y);
        ctx.lineTo(b.screen.x, b.screen.y);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  private drawStars(ctx: CanvasRenderingContext2D, selectedStarId: string | null): void {
    for (const p of this.projected) {
      if (!p.screen.visible) {
        continue;
      }
      const { x, y } = p.screen;
      if (p.star.magnitude <= GLOW_MAG_LIMIT) {
        const glow = ctx.createRadialGradient(x, y, 0, x, y, p.radiusPx * 3.2);
        glow.addColorStop(0, withAlpha(p.color, Math.min(1, p.alpha * 0.55)));
        glow.addColorStop(1, withAlpha(p.color, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, p.radiusPx * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(x, y, p.radiusPx, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      if (selectedStarId === p.star.id) {
        ctx.beginPath();
        ctx.arc(x, y, p.radiusPx + 4, 0, Math.PI * 2);
        ctx.strokeStyle = getCssVar('--amp-accent-warm', '#ffb454');
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
  }

  private drawLabels(ctx: CanvasRenderingContext2D, frame: SkyRenderFrame): void {
    const cx = frame.width / 2;
    const cy = frame.height / 2;
    const R = domeRadiusPx(frame.width, frame.height, frame.camera.zoom);
    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.fillStyle = getCssVar('--amp-text-muted', '#8b9bb8');
    ctx.textBaseline = 'middle';

    for (const p of this.projected) {
      if (!p.screen.visible || p.star.magnitude > LABEL_MAG_LIMIT) {
        continue;
      }
      const label = frame.labelForStar(p.star.id, p.star.nameLatin);
      let tw = this.labelWidthCache.get(p.star.id);
      if (tw === undefined) {
        tw = ctx.measureText(label).width;
        this.labelWidthCache.set(p.star.id, tw);
      }
      const lx = p.screen.x + p.radiusPx + 4;
      const ly = p.screen.y;
      const dist = Math.hypot(lx + tw / 2 - cx, ly - cy);
      if (dist > R - 8) {
        continue;
      }
      ctx.globalAlpha = 0.85;
      ctx.fillText(label, lx, ly);
    }
    ctx.globalAlpha = 1;
  }

  private drawHoverConstellationLabel(
    ctx: CanvasRenderingContext2D,
    constellations: readonly Constellation[],
    frame: SkyRenderFrame,
  ): void {
    const c = constellations.find((x) => x.id === frame.hoveredConstellationId);
    if (!c || !frame.constellationLabel) {
      return;
    }
    const pts = this.projected.filter(
      (p) => p.screen.visible && p.star.constellationId === c.id,
    );
    if (pts.length === 0) {
      return;
    }
    const mx = pts.reduce((s, p) => s + p.screen.x, 0) / pts.length;
    const my = pts.reduce((s, p) => s + p.screen.y, 0) / pts.length;
    ctx.font = '12px "Orbitron", sans-serif';
    ctx.fillStyle = getCssVar('--amp-accent-warm', '#ffb454');
    ctx.textAlign = 'center';
    ctx.globalAlpha = 0.95;
    ctx.fillText(frame.constellationLabel, mx, my - 12);
    ctx.textAlign = 'start';
    ctx.globalAlpha = 1;
  }
}

function getCssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') {
    return fallback;
  }
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function withAlpha(hexOrCss: string, alpha: number): string {
  if (hexOrCss.startsWith('#') && (hexOrCss.length === 7 || hexOrCss.length === 4)) {
    const hex =
      hexOrCss.length === 4
        ? `#${hexOrCss[1]}${hexOrCss[1]}${hexOrCss[2]}${hexOrCss[2]}${hexOrCss[3]}${hexOrCss[3]}`
        : hexOrCss;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hexOrCss;
}
