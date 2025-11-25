<script lang="ts">
	import type { Document } from '$lib/types';

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
				<svg
					class="document-list__icon"
					width="14"
					height="16"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M13 4.5V14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h7.5L13 4.5Z"
						stroke="currentColor"
						stroke-width="2"
						fill="none"
						fill-rule="evenodd"
					/>
				</svg>
				<div class="document-list__content">
					<span class="document-list__date">{document.date}</span>
					<span class="document-list__name">{document.name}</span>
				</div>
			</button>
		</li>
	{/each}
</ul>
