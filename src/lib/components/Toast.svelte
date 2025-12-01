<script lang="ts">
	import type { ToastType } from '$lib/stores/notifications.svelte';

	interface Props {
		id: string;
		type: ToastType;
		message: string;
		dismissible?: boolean;
		isClosing?: boolean;
		onclose?: (id: string) => void;
		onpause?: (id: string) => void;
		onresume?: (id: string) => void;
	}

	let {
		id,
		type,
		message,
		dismissible = true,
		isClosing = false,
		onclose,
		onpause,
		onresume
	}: Props = $props();
</script>

<div
	class={`toast toast--${type} ${isClosing ? 'toast--closing' : ''}`}
	onmouseenter={() => onpause?.(id)}
	onmouseleave={() => onresume?.(id)}
	role={type === 'error' || type === 'warning' ? 'alert' : 'status'}
	aria-live={type === 'error' || type === 'warning' ? 'assertive' : 'polite'}
>
	<!-- Icon -->
	<div class="toast__icon" aria-hidden="true">
		{#if type === 'success'}✓{/if}
		{#if type === 'error'}✕{/if}
		{#if type === 'warning'}⚠{/if}
		{#if type === 'info'}ℹ{/if}
	</div>

	<!-- Message -->
	<div class="toast__message">{message}</div>

	<!-- Close button -->
	{#if dismissible}
		<button class="toast__close" onclick={() => onclose?.(id)} aria-label="Dismiss notification">
			×
		</button>
	{/if}
</div>
