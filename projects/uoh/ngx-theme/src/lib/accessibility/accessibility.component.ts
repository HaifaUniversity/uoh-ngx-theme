import { Component, Input } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'uoh-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss'],
  host: { class: 'uoh-accessibility' }
})
export class AccessibilityComponent {
  @Input() dir = 'rtl';
  DARK_THEME = 'dark-theme';
  private THEME_KEY = 'theme';
  private FONT_SIZE_KEY = 'font-size';
  private _theme: string;
  private _fontSize: number;

  get theme(): string {
    if (!this._theme) {
      return localStorage.getItem(this.THEME_KEY);
    }
    return this._theme;
  }

  set theme(theme: string) {
    if (this.overlayContainer.getContainerElement().classList.contains(this._theme)) {
      this.overlayContainer.getContainerElement().classList.remove(this._theme);
    }
    if (theme) {
      this.overlayContainer.getContainerElement().classList.add(theme);
    }
    localStorage.setItem(this.THEME_KEY, theme);
    this._theme = theme;
  }

  get fontSize(): number {
    if (!this._fontSize) {
      const fontSize = localStorage.getItem(this.FONT_SIZE_KEY);
      if (fontSize) {
        return +fontSize;
      } else {
        return 0;
      }
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

  toggleTheme(): void {
    this.theme = this.theme === this.DARK_THEME ? '' : this.DARK_THEME;
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
}
