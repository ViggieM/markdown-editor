<script lang="ts">
	import type { FileWithHandle } from 'browser-fs-access';
	import FileIcon from '$lib/assets/file.svg?raw';
	import { formatDate } from '$lib/utils/date';

	interface Props {
		files: FileWithHandle[];
		selectedIdx?: number;
		onFileSelect?: (file: FileWithHandle) => void;
	}

	let { files = $bindable(), selectedIdx, onFileSelect }: Props = $props();
</script>

<ul class="document-list">
	{#each files as file, idx (idx)}
		<li class="document-list__item">
			<button
				class="document-list__button"
				class:document-list__button--selected={idx === selectedIdx}
				onclick={() => onFileSelect?.(file)}
				type="button"
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html FileIcon}
				<div class="document-list__content">
					<span class="document-list__date">{formatDate(file.lastModified)}</span>
					<span class="document-list__name">{file.name}</span>
				</div>
			</button>
		</li>
	{/each}
</ul>
