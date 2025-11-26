<script lang="ts">
	import { marked } from 'marked';
	import eyeIcon from '$lib/assets/eye.svg?raw';
	import eyeOffIcon from '$lib/assets/eye-off.svg?raw';

	interface Props {
		markdown?: string;
	}

	let { markdown = $bindable('') }: Props = $props();

	// Component state
	let showMarkdown = $state(true);
	let renderedHtml = $derived(marked.parse(markdown));

	// Toggle markdown column visibility
	function toggleMarkdown() {
		showMarkdown = !showMarkdown;
	}
</script>

<div class="editor">
	<!-- Markdown Column -->
	{#if showMarkdown}
		<div class="editor__column editor__column--markdown">
			<div class="editor__header">
				<h2 class="editor__title">Markdown</h2>
			</div>
			<textarea class="editor__textarea" bind:value={markdown} placeholder="Enter markdown here..."
			></textarea>
		</div>
	{/if}

	<!-- Preview Column -->
	<div class="editor__column editor__column--preview">
		<div class="editor__header">
			<h2 class="editor__title">Preview</h2>
			<button
				class="editor__toggle"
				onclick={toggleMarkdown}
				type="button"
				aria-label={showMarkdown ? 'Hide markdown' : 'Show markdown'}
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html showMarkdown ? eyeIcon : eyeOffIcon}
			</button>
		</div>
		<div class="editor__preview">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html renderedHtml}
		</div>
	</div>
</div>
