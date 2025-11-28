<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Editor from '$lib/components/Editor.svelte';
	import { fileStore } from '$lib/stores/editor.svelte';
	import type { FileWithHandle } from 'browser-fs-access';

	let isMenuOpen = $state(true);
	let sidebarWidth = $derived(isMenuOpen ? '250px' : '0px');

	let selectedFile: FileWithHandle | undefined = $derived(
		fileStore.markdownFiles[fileStore.selectedFileIdx]
	);
	let documentName = $state('');
	let fileContent = $state('');
	let initialContent = $state('');

	let isSaveDisabled = $derived(
		selectedFile?.name === documentName && fileContent === initialContent
	);

	async function onFileSelect(file: FileWithHandle) {
		console.log('selectedFileIdx', fileStore.selectedFileIdx);
		fileStore.select(file);
		selectedFile = file;
		documentName = selectedFile?.name || '';
		fileContent = initialContent = await fileStore.readFile(file);
	}

	function onSave() {
		if (!selectedFile || !selectedFile.handle) return;
		fileStore.save(selectedFile, documentName, fileContent);
	}

	function onNewDocument() {
		fileStore.createNewFile();
		selectedFile = fileStore.markdownFiles[fileStore.selectedFileIdx];
	}

	function onDelete() {
		if (!selectedFile) return;
		fileStore.deleteFile(selectedFile);
		fileStore.select(null);
		documentName = fileContent = initialContent = '';
	}
</script>

<div class="markdown-editor" style="--sidebar-width: {sidebarWidth}">
	<div><Sidebar bind:isMenuOpen {onFileSelect} {onNewDocument} /></div>
	<div class="content">
		<Header bind:isMenuOpen bind:documentName {isSaveDisabled} {onSave} {onDelete}></Header>
		<Editor bind:markdown={fileContent}></Editor>
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
