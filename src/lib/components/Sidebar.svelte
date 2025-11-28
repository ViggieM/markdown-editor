<script lang="ts">
	import DocumentList from './DocumentList.svelte';
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	import { fileStore } from '$lib/stores/editor.svelte';

	interface Props {
		isMenuOpen: boolean;
		onNewDocument?: () => void;
		onFileSelect?: (file: File) => void;
	}

	let { isMenuOpen = $bindable(), onNewDocument, onFileSelect }: Props = $props();
</script>

<aside class="sidebar" class:sidebar--open={isMenuOpen}>
	<nav class="sidebar__nav">
		<header class="sidebar__header">
			<div class="sidebar__logo">MARKDOWN</div>
			<div class="sidebar__title">My Documents</div>
			{#if fileStore.isFolderSelected}
				<button class="sidebar__new-document" onclick={() => onNewDocument?.()} type="button">
					+ New Document
				</button>
			{:else}
				<button class="btn btn-primary w-full mt-4" onclick={() => fileStore.loadFiles()}>
					Select Directory
				</button>
			{/if}
		</header>

		<div class="sidebar__list">
			<DocumentList
				bind:files={fileStore.markdownFiles}
				{onFileSelect}
				selectedId={fileStore.selectedFile?.name}
			/>
		</div>

		<footer class="sidebar__footer">
			<DarkModeToggle />
		</footer>
	</nav>
</aside>
