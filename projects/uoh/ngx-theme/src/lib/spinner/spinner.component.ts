import { Component, Input, OnInit, OnDestroy, HostBinding } from '@angular/core';

import { Subscription } from 'rxjs';

import { UohSpinner } from './spinner.service';
import { Point, Size, Stops } from './models';

@Component({
  selector: 'uoh-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'uoh-spinner';
  @Input() size: Size;
  @Input() duration = 2000;
  @Input() fps = 60;
  @Input() minStrokeWidth = 15;
  @Input() maxStrokeWidth = 50;
  @Input() circle: Stops = { stop1: 0.35, stop2: 0.85 };
  @Input()
  path =
    'M 0,101 120,0 180,50.5 240,0 300,50.5 360,0 360,59 335.05078,80 360,101 360,160 240,59 215.04883,80 240,101 240,160' +
    ' 180,109.5 120,160 120,101 144.95117,80 120,59 0,160 0,101 Z';
  dashArray: string;
  dashOffset: number;
  strokeWidth: number;
  viewBox: string;
  groupTransform: string;
  visible = false;
  private _frameInterval: number;
  private _strokeInc: Stops;
  private _points: Point[];
  private _perimeter: number;
  private _svgSize: Size = { width: 360, height: 160 };
  private _defaultSize: Size = { width: 180, height: 80 };
  private _requestID: number;
  private _loading$: Subscription;

  constructor(private _loader: UohSpinner) {}

  ngOnInit(): void {
    this.size = this.size ? this.calcSize(this.size, this._svgSize) : this._defaultSize;
    this.viewBox = `0 0 ${this._svgSize.width + this.maxStrokeWidth} ${this._svgSize.height + this.maxStrokeWidth}`;
    const pos = this.maxStrokeWidth / 2;
    this.groupTransform = `translate(${pos}, ${pos})`;
    this._frameInterval = 1000 / this.fps;
    this._points = this.parsePoints(this.path);
    this._perimeter = this.calcPerimeter(this._points);
    this._strokeInc = this.getStrokeIncrement(this.duration, this.circle, this.minStrokeWidth, this.maxStrokeWidth);
    this._loading$ = this._loader.loading.subscribe(loading =>
      loading ? this.startAnimation() : this.stopAnimation()
    );
  }

  ngOnDestroy(): void {
    if (this._loading$) {
      this._loading$.unsubscribe();
    }
  }

  /**
   * Starts a new spinner animation.
   */
  private startAnimation(): void {
    this.resetParams();
    this._requestID = window.requestAnimationFrame(time => {
      const startTime = this.correctTime(time);
      this.draw(startTime, startTime);
    });
    this.visible = true;
  }

  /**
   * Stops the spinner animation.
   */
  private stopAnimation(): void {
    this.visible = false;
    this.cancelRequestID();
  }

  /**
   * Resets the spinner stroke width.
   */
  private resetParams(): void {
    this.strokeWidth = this.maxStrokeWidth;
  }

  /**
   * Cancels the current window's request animation frame.
   */
  private cancelRequestID(): void {
    if (this._requestID !== undefined) {
      window.cancelAnimationFrame(this._requestID);
    }
  }

  /**
   * Draws a new position for the spinner for the current frame.
   * @param time The current time according to the window's animation frame.
   * @param startTime The time when the spinner was started.
   */
  private draw(time: number, startTime: number): void {
    const timeElapsed = time - startTime;
    let percent = timeElapsed / this.duration;

    if (percent >= 1) {
      startTime = time;
      percent = 1;
    }

    if (percent >= this.circle.stop2) {
      this.strokeWidth =
        this.minStrokeWidth + (timeElapsed - this.duration * this.circle.stop2) * this._strokeInc.stop2;
    } else if (percent <= this.circle.stop1) {
      this.strokeWidth = this.maxStrokeWidth - timeElapsed * this._strokeInc.stop1;
    }

    const loader = this.easeInOut(percent) * this._perimeter;
    this.dashArray = `${loader},${this._perimeter}`;
    this.dashOffset = (loader - 1) * -1;

    this._requestID = window.requestAnimationFrame(nextTime => {
      this.draw(this.correctTime(nextTime), startTime);
    });
  }

  /**
   * Corrects the current time according to the frame interval (frames per second).
   * @param time The current time according to the window's animation frame.
   */
  private correctTime(time: number): number {
    return time - (time % this._frameInterval);
  }

  /**
   * Calculates the size of the spinner.
   * @param currSize The requested size for the spinner.
   * @param origSize The original size of the spinner svg.
   */
  private calcSize(currSize: Size, origSize: Size): Size {
    if (currSize.width) {
      currSize.height = (origSize.width / currSize.width) * origSize.height;
    } else {
      currSize.width = (origSize.height / currSize.height) * origSize.width;
    }

    return currSize;
  }

  /**
   * Calculates the perimeter of the spinner drawing.
   * @param points An array of points for the svg drawing of the spinner.
   */
  private calcPerimeter(points: Point[]): number {
    return points.reduce((accum, currPoint, currIndex) => {
      const nextIndex = currIndex + 1 >= points.length ? 0 : currIndex + 1;
      const nextPoint = points[nextIndex];
      const diffX = currPoint.x - nextPoint.x;
      const diffY = currPoint.y - nextPoint.y;
      return accum + Math.sqrt(diffX * diffX + diffY * diffY);
    }, 0);
  }

  /**
   * Returns an array of points according to a certaing svg path.
   * @param path The svg drawing path.
   */
  private parsePoints(path: string): Point[] {
    return path
      .replace(/M\s|\sZ/g, '')
      .split(' ')
      .map(point => {
        const coords = point.split(',');
        return { x: +coords[0], y: +coords[1] };
      });
  }

  /**
   * Caculates the stroke width increment.
   * @param duration The total duration of the animation.
   * @param stops The stops for the progress point.
   * @param min The minimum stroke width.
   * @param max The maximum stroke width.
   */
  private getStrokeIncrement(duration: number, stops: Stops, min: number, max: number): Stops {
    const steps1 = duration * stops.stop1;
    const steps2 = duration * (1 - stops.stop2);
    const increment1 = (max - min) / steps1;
    const increment2 = (max - min) / steps2;

    return {
      stop1: increment1,
      stop2: increment2
    };
  }

  /**
   * Recalculates the frame time according to the ease in out function.
   * @param time The current time according to the window animation frame.
   */
  private easeInOut(time: number): number {
    const timeSqr = time * time;
    return timeSqr / (2 * (timeSqr - time) + 1);
  }
}
