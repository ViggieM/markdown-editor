<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Editor from '$lib/components/Editor.svelte';

	let isMenuOpen = $state(true);
	let sidebarWidth = $derived(isMenuOpen ? '250px' : '0px');
	$effect(() => {
		console.log(isMenuOpen ? 'menu opened' : 'menu closed');
	});
</script>

<div class="markdown-editor" style="--sidebar-width: {sidebarWidth}">
	<div><Sidebar bind:isMenuOpen /></div>
	<div class="content">
		<Header bind:isMenuOpen></Header>
		<Editor></Editor>
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
