<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Button from '$lib/components/Button.svelte';
	import SaveIcon from '$lib/assets/save.svg';
	import TrashIcon from '$lib/assets/trash.svg';
	import FileIcon from '$lib/assets/file.svg';

	interface Props {
		documentName?: string;
		onSave?: () => void;
		onDelete?: () => void;
		onMenuToggle?: () => void;
		isSaveDisabled?: boolean;
	}

	let {
		documentName = 'welcome.md',
		onSave,
		onDelete,
		onMenuToggle,
		isSaveDisabled = false
	}: Props = $props();
</script>

<header class="header">
	<div class="header-left">
		<Sidebar onclick={onMenuToggle} />
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
		<button class="header-delete shrink-0" onclick={onDelete} aria-label="Delete document">
			<img src={TrashIcon} alt="" />
		</button>
		<Button size="small" variant="primary" onclick={onSave} disabled={isSaveDisabled}>
			<img src={SaveIcon} alt="" /><span class="header-save-label">&nbsp;Save Changes</span>
		</Button>
	</div>
</header>
