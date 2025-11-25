<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import MarkdownEditor from './MarkdownEditor.svelte';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Markdown Editor',
		component: MarkdownEditor,
		parameters: {
			// More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
			layout: 'fullscreen'
		}
	});
</script>

<!-- Demo page showing sidebar displacement behavior -->
<Story name="Markdown Editor" />
