<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Editor from '$lib/components/Editor.svelte';
	import { fileStore } from '$lib/stores/editor.svelte';

	let isMenuOpen = $state(true);
	let sidebarWidth = $derived(isMenuOpen ? '250px' : '0px');

	let isSaveDisabled = $derived(
		fileStore.selectedFile?.name === fileStore.selectedFileTitle &&
			fileStore.selectedFileContent === fileStore.initialFileContent
	);

	function onFileSelect(file: File) {
		fileStore.select(file);
	}

	function onSave() {
		console.log('Saving...');
		fileStore.save();
	}

	function onNewDocument() {
		fileStore.createNewFile();
	}

	function onDelete() {
		fileStore.deleteSelectedFile();
	}
</script>

<div class="markdown-editor" style="--sidebar-width: {sidebarWidth}">
	<div><Sidebar bind:isMenuOpen {onFileSelect} {onNewDocument} /></div>
	<div class="content">
		<Header
			bind:isMenuOpen
			bind:documentName={fileStore.selectedFileTitle}
			{isSaveDisabled}
			{onSave}
			{onDelete}
		></Header>
		<Editor bind:markdown={fileStore.selectedFileContent}></Editor>
	</div>
</div>

<style>
	.markdown-editor {
		--sidebar-width: 0px;
		--sidebar-transition: 0.3s ease;

		display: grid;
		grid-template-columns: var(--sidebar-width) 1fr;
		transition: grid-template-columns var(--sidebar-transition);
	}

	.content {
		height: 100vh;
		display: grid;
		grid-template-rows: auto 1fr;
	}
</style>
