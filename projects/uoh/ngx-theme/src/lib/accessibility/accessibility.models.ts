export interface UohAccessibilityLabels {
  header: string;
  increaseFont: string;
  decreaseFont: string;
  lowContrast: string;
  highContrast: string;
  reset: string;
  manifest: string;
}

/**
 * Represents the different themes to choose from.
 */
export enum UohTheme {
  Light = 'light',
  Dark = 'dark',
}

/**
 * The default theme.
 */
export const UOH_DEFAULT_THEME = UohTheme.Light;
/**
 * The default font size.
 */
export const UOH_DEFAULT_FONT_SIZE = 0;
/**
 * The maximum font size level (maximum font increase) where 0 is the default.
 */
export const UOH_MAX_FONT_SIZE = 5;
/**
 * The minimum font size level (minimum font decrease) where 0 is the default.
 */
export const UOH_MIN_FONT_SIZE = -2;
/**
 * The prefix for the font size level class.
 * The prefix will be followed by the number that represents the level (0 for default).
 */
export const UOH_FONT_SIZE_PREFIX = 'font-size-';
