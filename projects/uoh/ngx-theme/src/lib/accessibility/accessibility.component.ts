import { Component, Input, HostBinding, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Direction } from '@angular/cdk/bidi';
import { UohAccessibilityLabels } from './accessibility.models';

@Component({
  selector: 'uoh-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss']
})
export class AccessibilityComponent implements OnInit {
  @HostBinding('class') class = 'uoh-accessibility';
  @Input() dir: Direction = 'rtl';
  @Input() labels: UohAccessibilityLabels = {
    header: 'תפריט נגישות',
    increaseFont: 'הגדלת פונט',
    decreaseFont: 'הקטנת פונט',
    lowContrast: 'ניגודיות בהירה',
    highContrast: 'ניגודיות כהה',
    reset: 'איפוס הגדרות',
    manifest: 'הצהרת נגישות'
  };
  @Input() manifestUrl = 'https://www.haifa.ac.il/index.php/he/accessibility-decleration';
  private DARK_THEME = 'dark-theme';
  private THEME_KEY = 'theme';
  private FONT_SIZE_KEY = 'font-size';
  private _theme: string;
  private _fontSize = 0;

  get theme(): string {
    if (!this._theme) {
      const theme = localStorage.getItem(this.THEME_KEY);

      return theme ? theme : '';
    }
    return this._theme;
  }

  set theme(theme: string) {
    this.removeOverlayClass(this._theme);
    this.setOverlayClass(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this._theme = theme;
  }

  get fontSize(): number {
    if (!this._fontSize) {
      const fontSize = localStorage.getItem(this.FONT_SIZE_KEY);

      return fontSize ? +fontSize : 0;
    }
    return this._fontSize;
  }

  set fontSize(fontSize: number) {
    if (!fontSize) {
      fontSize = 0;
    }
    localStorage.setItem(this.FONT_SIZE_KEY, fontSize.toString());
    this._fontSize = fontSize;
  }

  constructor(private overlayContainer: OverlayContainer) {}

  ngOnInit(): void {
    this.setOverlayClass(this.theme);
  }

  toggleTheme(): void {
    this.theme = this.isDarkTheme() ? '' : this.DARK_THEME;
  }

  increaseFontSize(): void {
    if (this.fontSize < 5) {
      this.fontSize++;
    }
  }

  decreaseFontSize(): void {
    if (this.fontSize > -2) {
      this.fontSize--;
    }
  }

  reset(): void {
    this.theme = '';
    this.fontSize = 0;
  }

  isDarkTheme(): boolean {
    return this.theme === this.DARK_THEME;
  }

  private setOverlayClass(theme: string): void {
    if (theme) {
      this.overlayContainer.getContainerElement().classList.add(theme);
    }
  }

  private removeOverlayClass(theme: string): void {
    if (theme && this.overlayContainer.getContainerElement().classList.contains(theme)) {
      this.overlayContainer.getContainerElement().classList.remove(theme);
    }
  }
}
