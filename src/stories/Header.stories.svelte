<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Header from '$lib/components/Header.svelte';
	import { fn } from 'storybook/test';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Components/Header',
		component: Header,
		// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
		tags: ['autodocs'],
		parameters: {
			// More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
			layout: 'fullscreen'
		},
		args: {
			onSave: fn(() => console.log('Save clicked')),
			onDelete: fn(() => console.log('Delete clicked')),
			onMenuToggle: fn(() => console.log('Menu toggled'))
		}
	});
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default" />

<Story name="CustomDocument" args={{ documentName: 'my-super-long-title.notes.md' }} />

<Story name="SaveDisabled" args={{ isSaveDisabled: true }} />
