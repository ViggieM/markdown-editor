// ABOUTME: Server-side hooks for theme cookie handling and SSR
// ABOUTME: Injects theme attribute into HTML before first paint to prevent FOWT

import { type Handle } from '@sveltejs/kit';
import { THEME_COOKIE_NAME, DEFAULT_THEME, isValidTheme } from '$lib/themes';

export const handle: Handle = async ({ event, resolve }) => {
	// Read theme from cookie
	const cookieTheme = event.cookies.get(THEME_COOKIE_NAME);
	const theme = cookieTheme && isValidTheme(cookieTheme) ? cookieTheme : DEFAULT_THEME;

	// Store theme in locals for access in load functions if needed
	event.locals.theme = theme;

	// Transform HTML to inject data-theme attribute before first paint
	return await resolve(event, {
		transformPageChunk: ({ html }) => {
			// Replace <html lang="en"> with <html lang="en" data-theme="dark|light">
			return html.replace(/<html lang="en">/, `<html lang="en" data-theme="${theme}">`);
		}
	});
};
