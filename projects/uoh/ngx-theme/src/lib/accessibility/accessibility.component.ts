import { Component, Input, HostBinding, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Direction } from '@angular/cdk/bidi';
import { UohAccessibilityLabels } from './accessibility.models';

/**
 * Stores the selected accessibility css class (theme, font size) & sets it in the overlay (i.e. for dialogs).
 */
class UohAccessibilityClass {
  private _value: string;

  /**
   * Creates a new accessibility class.
   * @param overlayContainer The cdk overlay container used for dialogs and other overlayed components.
   * @param key The key used to store the class.
   * @param defaultValue The default value for the class.
   */
  constructor(private overlayContainer: OverlayContainer, public key: string, public defaultValue: string) {
    const value = localStorage.getItem(this.key);

    this.value = value ? value : this.defaultValue;
  }

  /**
   * Retrieves the current class value.
   */
  get value(): string {
    return this._value;
  }

  /**
   * Sets a new value for the class & adds it to the overlay.
   */
  set value(value: string) {
    this.removeOverlayClass(this._value);
    this.setOverlayClass(value);
    localStorage.setItem(this.key, value);
    this._value = value;
  }

  /**
   * Resets the class to the default value.
   */
  reset(): void {
    this.value = this.defaultValue;
  }

  /**
   * Sets a new css class in the overlay container.
   * @param value The css class.
   */
  private setOverlayClass(value: string): void {
    if (value) {
      this.overlayContainer.getContainerElement().classList.add(value);
    }
  }

  /**
   * Removes an existing css class from the overlay container.
   * @param value The css class.
   */
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
  private readonly FONT_SIZE_PREFIX = 'font-size-';

  constructor(private overlayContainer: OverlayContainer) {
    this.theme = new UohAccessibilityClass(overlayContainer, 'theme', '');
    this.fontSize = new UohAccessibilityClass(overlayContainer, 'font-size', `${this.FONT_SIZE_PREFIX}0`);
  }

  ngOnInit(): void {}

  /**
   * Toggles between the default and dark themes.
   */
  toggleTheme(): void {
    this.theme.value = this.isDarkTheme() ? '' : this.DARK_THEME;
  }

  /**
   * Increases the font size.
   */
  increaseFontSize(): void {
    let num = this.getFontSizeNum(this.fontSize.value);
    if (num < 5) {
      num++;
      this.setFontSize(num);
    }
  }

  /**
   * Decreases the font size.
   */
  decreaseFontSize(): void {
    let num = this.getFontSizeNum(this.fontSize.value);
    if (num > -2) {
      num--;
      this.setFontSize(num);
    }
  }

  /**
   * Resets the theme and the font size to defaults.
   */
  reset(): void {
    this.theme.reset();
    this.fontSize.reset();
  }

  /**
   * Checks whether the dark theme is on.
   */
  isDarkTheme(): boolean {
    return this.theme.value === this.DARK_THEME;
  }

  /**
   * Sets the class for the respective font size.
   * @param num The index for the font size class.
   */
  private setFontSize(num: number): void {
    this.fontSize.value = `${this.FONT_SIZE_PREFIX}${num}`;
  }

  /**
   * Returns the index for a font size class.
   * @param value The font size class.
   */
  private getFontSizeNum(value: string): number {
    const num = value.replace(this.FONT_SIZE_PREFIX, '');

    return num && !isNaN(+num) ? +num : 0;
  }
}
