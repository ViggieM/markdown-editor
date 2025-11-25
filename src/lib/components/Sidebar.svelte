<script lang="ts">
	import DocumentList from './DocumentList.svelte';
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	import type { Document } from '$lib/types';

	interface Props {
		isMenuOpen: boolean;
		onNewDocument?: () => void;
		onDocumentSelect?: (document: Document) => void;
	}

	let { isMenuOpen = $bindable(), onNewDocument, onDocumentSelect }: Props = $props();

	const exampleDocuments: Document[] = [
		{
			id: '1',
			name: 'welcome.md',
			date: '01 April 2022'
		},
		{
			id: '2',
			name: 'untitled-document.md',
			date: '01 April 2022'
		},
		{
			id: '3',
			name: 'getting-started.md',
			date: '15 March 2022'
		}
	];
</script>

<aside class="sidebar" class:sidebar--open={isMenuOpen}>
	<nav class="sidebar__nav">
		<header class="sidebar__header">
			<div class="sidebar__logo">MARKDOWN</div>
			<div class="sidebar__title">My Documents</div>
			<button class="sidebar__new-document" onclick={() => onNewDocument?.()} type="button">
				+ New Document
			</button>
		</header>

		<div class="sidebar__list">
			<DocumentList documents={exampleDocuments} {onDocumentSelect} />
		</div>

		<footer class="sidebar__footer">
			<DarkModeToggle />
		</footer>
	</nav>
</aside>
