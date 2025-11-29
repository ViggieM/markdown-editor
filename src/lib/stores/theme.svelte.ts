// ABOUTME: Theme state management with cookie and localStorage persistence
// ABOUTME: Uses data-theme attribute approach for dark mode with Svelte 5 runes

import { browser } from '$app/environment';
import {
	THEME_COOKIE_NAME,
	THEME_COOKIE_MAX_AGE,
	DEFAULT_THEME,
	isValidTheme,
	type Theme
} from '$lib/themes';

let currentTheme = $state<Theme>(DEFAULT_THEME);

export function getTheme(): Theme {
	return currentTheme;
}

export function setTheme(newTheme: Theme): void {
	if (!isValidTheme(newTheme)) {
		console.warn(`Invalid theme: ${newTheme}`);
		return;
	}

	currentTheme = newTheme;

	if (browser) {
		// Update DOM attribute immediately
		document.documentElement.setAttribute('data-theme', newTheme);

		// Save to localStorage
		localStorage.setItem(THEME_COOKIE_NAME, newTheme);

		// Save to cookie with 1 year expiration
		const oneYear = THEME_COOKIE_MAX_AGE;
		document.cookie = `${THEME_COOKIE_NAME}=${newTheme}; max-age=${oneYear}; path=/; SameSite=Lax`;
	}
}

export function initializeTheme(): void {
	if (!browser) return;

	try {
		// Priority: localStorage → data-theme attribute → default
		const stored = localStorage.getItem(THEME_COOKIE_NAME);
		if (stored && isValidTheme(stored)) {
			currentTheme = stored;
			return;
		}

		const domTheme = document.documentElement.getAttribute('data-theme');
		if (domTheme && isValidTheme(domTheme)) {
			currentTheme = domTheme;
			return;
		}

		currentTheme = DEFAULT_THEME;
	} catch (error) {
		console.error('Error initializing theme:', error);
		currentTheme = DEFAULT_THEME;
	}
}
