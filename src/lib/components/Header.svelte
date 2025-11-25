<script lang="ts">
	import HamburgerButton from '$lib/components/HamburgerButton.svelte';
	import Button from '$lib/components/Button.svelte';
	import SaveIcon from '$lib/assets/save.svg';
	import TrashIcon from '$lib/assets/trash.svg';
	import FileIcon from '$lib/assets/file.svg';

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
		documentName = 'welcome.md',
		onSave,
		onDelete,
		onMenuToggle,
		isSaveDisabled = false
	}: Props = $props();

	function handleMenuToggle() {
		isMenuOpen = !isMenuOpen;
		onMenuToggle?.();
	}
</script>

<header class="header">
	<div class="header-left">
		<HamburgerButton isOpen={isMenuOpen} onclick={handleMenuToggle} />
	</div>
	<div class="header-center">
		<span class="header-logo">MARKDOWN</span>
		<div class="header-divider"></div>
		<div class="header-doc-info">
			<span class="header-doc-label">Document Name</span>
			<div class="header-doc-name">
				<img src={FileIcon} alt="" />
				<input class="header-doc-name-input" type="text" value={documentName} />
			</div>
		</div>
	</div>
	<div class="header-right">
		<button
			class="header-delete btn btn-ghost btn-sm shrink-0"
			onclick={onDelete}
			aria-label="Delete document"
		>
			<img src={TrashIcon} alt="" />
		</button>
		<Button size="small" variant="primary" onclick={onSave} disabled={isSaveDisabled}>
			<img src={SaveIcon} alt="" /><span class="header-save-label">&nbsp;Save Changes</span>
		</Button>
	</div>
</header>
