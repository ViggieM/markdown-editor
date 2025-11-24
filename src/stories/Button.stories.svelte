<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from '$lib/components/Button.svelte';
	import { fn } from 'storybook/test';
	import saveIcon from '$lib/assets/save.svg';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Example/Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {
			variant: {
				control: { type: 'select' },
				options: ['primary', 'ghost']
			},
			size: {
				control: { type: 'select' },
				options: ['small', 'medium']
			},
			disabled: { control: 'boolean' }
		},
		args: {
			onclick: fn()
		}
	});
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Primary" args={{ variant: 'primary' }}>Button</Story>

<Story name="Ghost" args={{ variant: 'ghost' }}>Button</Story>

<Story name="Small" args={{ size: 'small', variant: 'primary' }}>Button</Story>

<Story name="Small Ghost" args={{ size: 'small', variant: 'ghost' }}>Button</Story>

<Story name="Disabled" args={{ variant: 'primary', disabled: true }}>Button</Story>

<Story name="Button with Icon" args={{ variant: 'primary' }}>
	<img src={saveIcon} />Button
</Story>
