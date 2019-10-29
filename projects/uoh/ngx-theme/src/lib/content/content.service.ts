import { Injectable } from '@angular/core';

import { UohPrivateContentService } from './private-content.service';

export interface BoundingClientRect {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
  x?: number;
  y?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UohContent {
  constructor(private uohContent: UohPrivateContentService) {}

  get top(): number {
    return this.getProperty('top');
  }

  get left(): number {
    return this.getProperty('left');
  }

  get bottom(): number {
    return this.getProperty('bottom');
  }

  get right(): number {
    return this.getProperty('right');
  }

  get width(): number {
    return this.getProperty('width');
  }

  get height(): number {
    return this.getProperty('height');
  }

  get x(): number {
    return this.getProperty('x');
  }

  get y(): number {
    return this.getProperty('y');
  }

  getProperty(prop: keyof BoundingClientRect): number {
    try {
      const properties: BoundingClientRect = this.uohContent.element.nativeElement.getBoundingClientRect();

      return properties[prop];
    } catch (e) {
      console.warn(`Cannot retrieve the property ${prop} from the UohContent`);
    }

    return undefined;
  }
}
