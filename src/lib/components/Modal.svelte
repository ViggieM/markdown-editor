<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		title?: Snippet;
		actions?: Snippet;
		open?: boolean;
		onclose?: () => void;
	}

	let { children, title, actions, open = false, onclose }: Props = $props();

	let dialogElement: HTMLDialogElement;

	$effect(() => {
		if (!dialogElement) return;

		if (open) {
			if (!dialogElement.open) {
				dialogElement.showModal();
			}
		} else {
			if (dialogElement.open) {
				dialogElement.close();
			}
		}
	});

	function handleClose() {
		onclose?.();
	}

	function handleBackdropClick(event: MouseEvent) {
		const rect = dialogElement.getBoundingClientRect();
		const clickedOutside =
			event.clientX < rect.left ||
			event.clientX > rect.right ||
			event.clientY < rect.top ||
			event.clientY > rect.bottom;
		if (clickedOutside) {
			handleClose();
		}
	}
</script>

<dialog bind:this={dialogElement} onclick={handleBackdropClick} onclose={handleClose}>
	<div
		class="modal__content"
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
		role="presentation"
	>
		{#if title}
			<header class="modal__header">
				<div class="modal__title">
					{@render title()}
				</div>
				<button class="modal__close" onclick={handleClose}>x</button>
			</header>
		{/if}
		<div class="modal__body">
			{@render children()}
		</div>

		{#if actions}
			<footer class="modal__footer">
				{@render actions()}
			</footer>
		{/if}
	</div>
</dialog>
