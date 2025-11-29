<script lang="ts">
	import '../styles/global.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initializeTheme } from '$lib/stores/theme.svelte';

	let { children } = $props();

	$effect(() => {
		initializeTheme();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
