<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		title?: Snippet;
		actions?: Snippet;
		open?: boolean;
		size?: 'small' | 'medium' | 'large';
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		onclose?: () => void;
	}

	let {
		children,
		title,
		actions,
		open = false,
		size = 'medium',
		closeOnBackdrop = true,
		closeOnEscape = true,
		onclose
	}: Props = $props();

	let dialogElement: HTMLDialogElement;
	let triggerElement: HTMLElement | null = null;

	$effect(() => {
		if (!dialogElement) return;

		if (open) {
			if (!dialogElement.open) {
				// Store the currently focused element before opening
				triggerElement = document.activeElement as HTMLElement;
				dialogElement.showModal();
			}
		} else {
			if (dialogElement.open) {
				dialogElement.close();
			}
		}
	});

	async function handleClose() {
		if (!dialogElement.open) return;

		// Add closing class for animation
		dialogElement.classList.add('modal--closing');

		// Wait for animation to complete
		await new Promise((resolve) => setTimeout(resolve, 200));

		// Remove closing class
		dialogElement.classList.remove('modal--closing');

		// Restore focus to trigger element
		if (triggerElement) {
			triggerElement.focus();
			triggerElement = null;
		}

		// Call the close callback
		onclose?.();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (!closeOnBackdrop) return;
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

<dialog
	class={['modal', `modal--${size}`]}
	bind:this={dialogElement}
	onclick={handleBackdropClick}
	onclose={(e) => {
		if (!closeOnEscape) {
			e.preventDefault();
			return;
		}
		handleClose();
	}}
	aria-labelledby={title ? 'modal-title' : undefined}
	aria-describedby="modal-description"
	aria-modal="true"
>
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
