import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UohAccessibility {
  constructor(private overlayContainer: OverlayContainer) {}
}
