<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from '$lib/components/Button.svelte';
	import ModalExample from './ModalExample.svelte';

	const { Story } = defineMeta({
		title: 'Components/Modal',
		component: ModalExample,
		tags: ['autodocs'], // todo: what are tags?
		argTypes: {
			size: {
				control: { type: 'select' },
				options: ['small', 'medium', 'large']
			}
		}
	});
</script>

<Story name="Basic" asChild>
	<ModalExample size="medium">
		<p>This is just a modal without a header and title</p>
	</ModalExample>
</Story>

<Story name="With Title" asChild>
	<ModalExample size="medium">
		{#snippet title()}
			<h2 style="margin: 0;">Modal Title</h2>
		{/snippet}
		<p>Hello! This is a modal with a title.</p>
	</ModalExample>
</Story>

<Story name="With Actions" asChild>
	<ModalExample size="medium">
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

<Story name="Small Size" asChild>
	<ModalExample size="small">
		{#snippet title()}
			<h2 style="margin: 0;">Small Modal</h2>
		{/snippet}
		<p>This is a small modal, perfect for alerts.</p>
		{#snippet actions()}
			<Button onclick={() => {}}>OK</Button>
		{/snippet}
	</ModalExample>
</Story>

<Story name="Large Size" asChild>
	<ModalExample size="large">
		{#snippet title()}
			<h2 style="margin: 0;">Large Modal</h2>
		{/snippet}
		<p>This is a large modal with more content space.</p>
		<p>Perfect for forms or detailed information.</p>
		<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
		{#snippet actions()}
			<Button onclick={() => {}}>Close</Button>
		{/snippet}
	</ModalExample>
</Story>
