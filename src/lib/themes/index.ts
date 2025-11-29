// ABOUTME: Theme configuration and constants for data-theme attribute approach
// ABOUTME: Provides type-safe theme values and cookie management utilities

export const THEMES = ['light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_COOKIE_NAME = 'theme';
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const DEFAULT_THEME: Theme = 'dark';

/**
 * Validates if a string is a valid theme
 */
export function isValidTheme(value: unknown): value is Theme {
	return typeof value === 'string' && THEMES.includes(value as Theme);
}
