<script>
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';

	let { children, title = null, actions = null, size } = $props();

	let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Open Modal</Button>

<Modal {open} onclose={() => (open = false)} {title} {actions} {size} {children}></Modal>
