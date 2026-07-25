import { Injectable } from '@angular/core';
import { HIT_SLOP_PX } from '../core/constants/render.constants';
import { equatorialToHorizontal as eqToHoriz } from '../domain/astronomy/coordinates.util';
import {
  findConstellationAtPointer as findConstAtPtr,
  findStarAtPointer as findStarAtPtr,
} from '../domain/astronomy/hit-test.util';
import { julianDate as toJulianDate } from '../domain/astronomy/julian.util';
import {
  gmstHours as toGmstHours,
  lstHours as toLstHours,
} from '../domain/astronomy/sidereal.util';
import {
  magnitudeToAlpha as magToAlpha,
  magnitudeToRadiusPx as magToRadius,
  spectralClassToColor as spectralToColor,
} from '../domain/astronomy/star-draw.util';
import { projectHorizontalToCanvas as horizToCanvas } from '../domain/astronomy/stereographic.util';
import type {
  CameraState,
  Constellation,
  HorizontalCoordinates,
  ObserverLocation,
  ProjectedStar,
  ScreenPoint,
  Star,
} from '../models/astronomy.types';

@Injectable({ providedIn: 'root' })
export class AstroMathService {
  julianDate(utcMs: number): number {
    return toJulianDate(utcMs);
  }

  gmstHours(utcMs: number): number {
    return toGmstHours(utcMs);
  }

  lstHours(utcMs: number, longitudeDeg: number): number {
    return toLstHours(utcMs, longitudeDeg);
  }

  equatorialToHorizontal(
    raHours: number,
    decDeg: number,
    lstHoursValue: number,
    latitudeDeg: number,
  ): HorizontalCoordinates {
    return eqToHoriz(raHours, decDeg, lstHoursValue, latitudeDeg);
  }

  projectHorizontalToCanvas(
    horizontal: HorizontalCoordinates,
    camera: CameraState,
    canvasWidth: number,
    canvasHeight: number,
  ): ScreenPoint {
    return horizToCanvas(horizontal, camera, canvasWidth, canvasHeight);
  }

  projectStar(
    star: Star,
    observer: ObserverLocation,
    utcMs: number,
    camera: CameraState,
    canvasWidth: number,
    canvasHeight: number,
  ): ProjectedStar {
    const lst = this.lstHours(utcMs, observer.longitudeDeg);
    const horizontal = this.equatorialToHorizontal(
      star.raHours,
      star.decDeg,
      lst,
      observer.latitudeDeg,
    );
    const screen = this.projectHorizontalToCanvas(
      horizontal,
      camera,
      canvasWidth,
      canvasHeight,
    );
    return {
      star,
      horizontal,
      screen,
      radiusPx: this.magnitudeToRadiusPx(star.magnitude, camera.zoom),
      color: this.spectralClassToColor(star.spectralClass),
      alpha: this.magnitudeToAlpha(star.magnitude),
    };
  }

  projectAllStars(
    stars: readonly Star[],
    observer: ObserverLocation,
    utcMs: number,
    camera: CameraState,
    canvasWidth: number,
    canvasHeight: number,
    into?: ProjectedStar[],
  ): ProjectedStar[] {
    const out = into ?? [];
    out.length = 0;
    const lst = this.lstHours(utcMs, observer.longitudeDeg);
    for (const star of stars) {
      const horizontal = this.equatorialToHorizontal(
        star.raHours,
        star.decDeg,
        lst,
        observer.latitudeDeg,
      );
      const screen = this.projectHorizontalToCanvas(
        horizontal,
        camera,
        canvasWidth,
        canvasHeight,
      );
      out.push({
        star,
        horizontal,
        screen,
        radiusPx: this.magnitudeToRadiusPx(star.magnitude, camera.zoom),
        color: this.spectralClassToColor(star.spectralClass),
        alpha: this.magnitudeToAlpha(star.magnitude),
      });
    }
    return out;
  }

  magnitudeToRadiusPx(magnitude: number, zoom: number): number {
    return magToRadius(magnitude, zoom);
  }

  magnitudeToAlpha(magnitude: number): number {
    return magToAlpha(magnitude);
  }

  spectralClassToColor(spectralClass: string): string {
    return spectralToColor(spectralClass);
  }

  findStarAtPointer(
    projected: readonly ProjectedStar[],
    x: number,
    y: number,
    hitSlopPx: number = HIT_SLOP_PX,
  ): Star | null {
    return findStarAtPtr(projected, x, y, hitSlopPx);
  }

  findConstellationAtPointer(
    projected: readonly ProjectedStar[],
    constellations: readonly Constellation[],
    x: number,
    y: number,
    hitSlopPx: number = HIT_SLOP_PX,
  ): Constellation | null {
    return findConstAtPtr(projected, constellations, x, y, hitSlopPx);
  }
}
