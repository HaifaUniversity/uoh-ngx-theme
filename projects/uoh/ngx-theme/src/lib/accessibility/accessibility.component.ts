import { Component, Input, HostBinding, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Direction } from '@angular/cdk/bidi';
import { UohAccessibilityLabels } from './accessibility.models';

class UohAccessibilityClass {
  private _value: string;

  constructor(private overlayContainer: OverlayContainer, public key: string, public defaultValue: string) {
    const value = localStorage.getItem(this.key);

    this.value = value ? value : this.defaultValue;
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this.removeOverlayClass(this._value);
    this.setOverlayClass(value);
    localStorage.setItem(this.key, value);
    this._value = value;
  }

  reset(): void {
    this.value = this.defaultValue;
  }

  private setOverlayClass(value: string): void {
    if (value) {
      this.overlayContainer.getContainerElement().classList.add(value);
    }
  }

  private removeOverlayClass(value: string): void {
    if (value && this.overlayContainer.getContainerElement().classList.contains(value)) {
      this.overlayContainer.getContainerElement().classList.remove(value);
    }
  }
}

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
  theme: UohAccessibilityClass;
  fontSize: UohAccessibilityClass;
  private readonly DARK_THEME = 'dark-theme';

  constructor(private overlayContainer: OverlayContainer) {
    this.theme = new UohAccessibilityClass(overlayContainer, 'theme', '');
    this.fontSize = new UohAccessibilityClass(overlayContainer, 'font-size', 'font-size-0');
  }

  ngOnInit(): void {}

  toggleTheme(): void {
    this.theme.value = this.isDarkTheme() ? '' : this.DARK_THEME;
  }

  increaseFontSize(): void {
    let num = this.getFontSizeNum(this.fontSize.value);
    if (num < 5) {
      num++;
      this.setFontSize(num);
    }
  }

  decreaseFontSize(): void {
    let num = this.getFontSizeNum(this.fontSize.value);
    if (num > -2) {
      num--;
      this.setFontSize(num);
    }
  }

  reset(): void {
    this.theme.reset();
    this.fontSize.reset();
  }

  isDarkTheme(): boolean {
    return this.theme.value === this.DARK_THEME;
  }

  private setFontSize(num: number): void {
    this.fontSize.value = `${this.fontSize.key}-${num}`;
  }

  private getFontSizeNum(value: string): number {
    const num = value.replace(`${this.fontSize.key}-`, '');

    return num && !isNaN(+num) ? +num : 0;
  }
}
