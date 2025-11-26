<script lang="ts">
	import type { FileWithHandle } from 'browser-fs-access';
	import FileIcon from '$lib/assets/file.svg?raw';

	interface Props {
		files: FileWithHandle[];
		selectedId?: string;
		onFileSelect?: (file: FileWithHandle) => void;
	}

	let { files = $bindable(), selectedId, onFileSelect }: Props = $props();

	// Transform File to display data
	function getFileId(file: FileWithHandle): string {
		return file.webkitRelativePath || file.name;
	}

	function formatDate(timestamp: number): string {
		const date = new Date(timestamp);
		const day = String(date.getDate()).padStart(2, '0');
		const month = date.toLocaleDateString('en-US', { month: 'long' });
		const year = date.getFullYear();
		return `${day} ${month} ${year}`;
	}
</script>

<ul class="document-list">
	{#each files as file (getFileId(file))}
		<li class="document-list__item">
			<button
				class="document-list__button"
				class:document-list__button--selected={selectedId === getFileId(file)}
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
