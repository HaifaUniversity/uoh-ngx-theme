import { Component } from '@angular/core';
import { UohContent } from '@uoh/ngx-theme';

@Component({
  selector: 'app-two',
  template: `
    <mat-card uohCard="medium" [uohCardCollapse]="true">
      <mat-card-header>
        <h1>Two works!</h1>
      </mat-card-header>
      <mat-card-content>
        <button (click)="test()">test</button>
      </mat-card-content>
    </mat-card>
  `
})
export class TwoComponent {
  constructor(private uohContent: UohContent) {}

  test(): void {
    console.log('content height', this.uohContent.height);
  }
}
