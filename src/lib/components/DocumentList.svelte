<script lang="ts">
	import type { Document } from '$lib/types';
	import FileIcon from '$lib/assets/file.svg?raw';

	interface Props {
		documents: Document[];
		selectedId?: string;
		onDocumentSelect?: (document: Document) => void;
	}

	let { documents, selectedId, onDocumentSelect }: Props = $props();
</script>

<ul class="document-list">
	{#each documents as document (document.id)}
		<li class="document-list__item">
			<button
				class="document-list__button"
				class:document-list__button--selected={selectedId === document.id}
				onclick={() => onDocumentSelect?.(document)}
				type="button"
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html FileIcon}
				<div class="document-list__content">
					<span class="document-list__date">{document.date}</span>
					<span class="document-list__name">{document.name}</span>
				</div>
			</button>
		</li>
	{/each}
</ul>
