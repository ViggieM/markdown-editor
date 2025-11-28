<script lang="ts">
	import HamburgerButton from '$lib/components/HamburgerButton.svelte';
	import Button from '$lib/components/Button.svelte';
	import SaveIcon from '$lib/assets/save.svg';
	import TrashIcon from '$lib/assets/trash.svg';
	import FileIcon from '$lib/assets/file.svg';
	import { Modal } from '$lib';

	interface Props {
		isMenuOpen: boolean;
		documentName?: string;
		onSave?: () => void;
		onDelete?: () => void;
		onMenuToggle?: () => void;
		isSaveDisabled?: boolean;
	}

	let {
		isMenuOpen = $bindable(),
		documentName = $bindable(),
		onSave,
		onDelete,
		onMenuToggle,
		isSaveDisabled = false
	}: Props = $props();

	let modalIsOpen = $state(false);

	function handleMenuToggle() {
		isMenuOpen = !isMenuOpen;
		onMenuToggle?.();
	}

	function openDeleteModal() {
		modalIsOpen = true;
	}

	function handleConfirmDelete() {
		onDelete?.();
		modalIsOpen = false;
	}
</script>

<header class="header">
	<div class="header-left">
		<HamburgerButton isOpen={isMenuOpen} onclick={handleMenuToggle} />
	</div>

	<div class="header-center">
		<h1 class="header-logo">MARKDOWN</h1>
		{#if documentName}
			<div class="header-divider"></div>
			<div class="header-doc-info">
				<span class="header-doc-label">Document Name</span>
				<div class="header-doc-name">
					<img src={FileIcon} alt="" />
					<input class="header-doc-name-input" type="text" bind:value={documentName} />
				</div>
			</div>
		{/if}
	</div>
	{#if documentName}
		<div class="header-right">
			<button
				class="header-delete btn btn-ghost btn-sm shrink-0"
				onclick={openDeleteModal}
				aria-label="Delete document"
			>
				<img src={TrashIcon} alt="" />
			</button>
			<Button size="small" variant="primary" onclick={onSave} disabled={isSaveDisabled}>
				<img src={SaveIcon} alt="" /><span class="header-save-label">&nbsp;Save Changes</span>
			</Button>
		</div>
	{/if}
</header>

<Modal size="small" open={modalIsOpen} onclose={() => (modalIsOpen = false)}>
	{#snippet title()}
		<h4>Delete this document?</h4>
	{/snippet}
	<p>
		Are you sure you want to delete the {documentName} document and its contents? This action cannot
		be reversed
	</p>
	{#snippet actions()}
		<Button class="w-full" onclick={handleConfirmDelete}>Confirm & Delete</Button>
	{/snippet}
</Modal>
