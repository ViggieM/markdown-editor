<script lang="ts">
	import Toast from './Toast.svelte';
	import { getToasts, removeToast, pauseToast, resumeToast } from '$lib/stores/notifications.svelte';

	const toasts = $derived(getToasts());
</script>

<div class="toaster" aria-live="polite">
	{#each toasts as toast (toast.id)}
		<Toast
			id={toast.id}
			type={toast.type}
			message={toast.message}
			dismissible={toast.dismissible}
			isClosing={toast.isClosing}
			onclose={removeToast}
			onpause={pauseToast}
			onresume={resumeToast}
		/>
	{/each}
</div>
