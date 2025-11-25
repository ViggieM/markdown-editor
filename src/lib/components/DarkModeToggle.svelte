<script lang="ts">
	import { themeState } from '$lib/stores/theme.svelte';
	import moonIcon from '$lib/assets/moon.svg';
	import sunIcon from '$lib/assets/sun.svg';

	function handleToggle(mode: 'light' | 'dark') {
		if (mode === 'dark' && !themeState.isDark) {
			themeState.toggle();
		} else if (mode === 'light' && themeState.isDark) {
			themeState.toggle();
		}
	}
</script>

<div class="toggle-container">
	<button
		class="toggle-option"
		class:active={!themeState.isDark}
		onclick={() => handleToggle('light')}
		aria-label="Light mode"
		type="button"
	>
		<img src={moonIcon} alt="Light mode" />
	</button>
	<button
		class="toggle-option"
		class:active={themeState.isDark}
		onclick={() => handleToggle('dark')}
		aria-label="Dark mode"
		type="button"
	>
		<img src={sunIcon} alt="Dark mode" />
	</button>
</div>
