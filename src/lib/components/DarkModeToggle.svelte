<script lang="ts">
	import { themeState } from '$lib/stores/theme.svelte';
	import moonIcon from '$lib/assets/moon.svg?raw';
	import sunIcon from '$lib/assets/sun.svg?raw';
</script>

<label class="inline-flex items-center cursor-pointer">
	<input
		type="checkbox"
		role="switch"
		checked={themeState.isDark}
		onchange={() => themeState.toggle()}
		aria-label="Dark mode toggle"
		class="sr-only"
	/>
	<span
		class="relative inline-flex items-center justify-between w-16 h-8 rounded-full transition-colors duration-300 {themeState.isDark
			? 'bg-gray-300'
			: 'bg-gray-800'}"
	>
		<span
			class="absolute left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out {!themeState.isDark
				? 'translate-x-8'
				: 'translate-x-0'}"
		></span>
		<span
			class="absolute left-2 w-4 h-4 transition-opacity duration-300 {themeState.isDark
				? 'text-gray-800 opacity-100'
				: 'text-gray-100 opacity-60'}"
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html moonIcon}
		</span>

		<span
			class="absolute right-2 w-4 h-4 transition-opacity duration-300 {themeState.isDark
				? 'text-gray-600 opacity-80'
				: 'text-gray-800 opacity-100'}"
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html sunIcon}
		</span>
	</span>
</label>
