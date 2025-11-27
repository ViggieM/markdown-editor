<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from '$lib/components/Button.svelte';
	import ModalExample from './ModalExample.svelte';

	const { Story } = defineMeta({
		title: 'Components/Modal',
		component: ModalExample,
		tags: ['autodocs'] // todo: what are tags?
	});
</script>

<Story name="Basic" asChild>
	<ModalExample>
		<p>This is just a modal without a header and title</p>
	</ModalExample>
</Story>

<Story name="With Title" asChild>
	<ModalExample>
		{#snippet title()}
			<h2 style="margin: 0;">Modal Title</h2>
		{/snippet}
		<p>Hello! This is a modal with a title.</p>
	</ModalExample>
</Story>

<Story name="With Actions" asChild>
	<ModalExample>
		{#snippet title()}
			<h2 style="margin: 0;">Modal Title</h2>
		{/snippet}
		<p>Are you sure you want to proceed?</p>
		{#snippet actions()}
			<Button variant="ghost" onclick={() => {}}>Cancel</Button>
			<Button onclick={() => {}}>Confirm</Button>
		{/snippet}
	</ModalExample>
</Story>
