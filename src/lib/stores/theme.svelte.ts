/**
 * Theme State Management
 *
 * Manages dark/light mode state with localStorage persistence.
 * Uses Svelte 5 runes for reactive state management.
 */

import { browser } from '$app/environment';

class ThemeState {
	isDark = $state(false);

	constructor() {
		if (browser) {
			// Load theme preference from localStorage
			const stored = localStorage.getItem('theme');
			this.isDark = stored === 'dark';
			this.applyTheme();
		}
	}

	toggle() {
		this.isDark = !this.isDark;
		if (browser) {
			localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
			this.applyTheme();
		}
	}

	private applyTheme() {
		if (browser) {
			document.documentElement.classList.toggle('dark', this.isDark);
		}
	}
}

export const themeState = new ThemeState();
