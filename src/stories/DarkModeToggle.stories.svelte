<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';

	const { Story } = defineMeta({
		title: 'Components/DarkModeToggle',
		component: DarkModeToggle,
		tags: ['autodocs']
	});
</script>

<Story name="Default">
	<DarkModeToggle />
</Story>

<Story name="On Dark Background">
	<div style="background-color: #1d1f22; padding: 2rem;">
		<DarkModeToggle />
	</div>
</Story>
