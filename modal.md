# Modal Component Implementation Guide

A production-ready modal dialog component using the native HTML `<dialog>` element with Svelte 5 runes.

## Features

- Native `<dialog>` element with built-in focus trapping
- Flexible content via snippets (title, body, actions)
- Three size variants (small, medium, large)
- Smooth open/close animations
- Backdrop click and ESC key support (configurable)
- Focus restoration after close
- Dark mode support
- ARIA accessibility attributes

## Files Required

**Create:**
- `/src/lib/components/Modal.svelte` - Main component
- `/src/styles/components/modal.css` - Component styles
- `/src/stories/ModalExample.svelte` - Story wrapper component
- `/src/stories/Modal.stories.svelte` - Storybook stories

**Modify:**
- `/src/lib/index.ts` - Add Modal export
- `/src/styles/components/index.css` - Import modal.css

## Implementation

### 1. Modal Component

**File:** `/src/lib/components/Modal.svelte`

```svelte
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
```

### 2. Modal Styles

**File:** `/src/styles/components/modal.css`

```css
/**
 * Modal Component Styles
 */

/* Dialog element - resets and positioning */
.modal {
	@apply border-none p-0 m-0;
	@apply max-w-none max-h-none;

	/* Center in viewport */
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	/* Backdrop styling */
	&::backdrop {
		background-color: rgba(21, 22, 25, 0.7);
	}
}

/* Size variants */
.modal--small .modal__content {
	@apply max-w-sm; /* 384px */
	min-width: 320px;
}

.modal--medium .modal__content {
	@apply max-w-lg; /* 512px */
	min-width: 400px;
}

.modal--large .modal__content {
	@apply max-w-2xl; /* 672px */
	min-width: 500px;
}

/* Modal content container */
.modal__content {
	@apply relative;
	@apply bg-gray-100 text-gray-1000;
	@apply dark:bg-gray-900 dark:text-gray-100;
	@apply rounded;
	border-radius: var(--radius);
	@apply shadow-2xl;
	@apply flex flex-col;
	@apply max-h-[90vh] w-full;
	min-width: 400px;
}

/* Header */
.modal__header {
	@apply flex items-center justify-between;
	@apply px-6 py-4;
	@apply border-b border-gray-300 dark:border-gray-700;
}

.modal__title {
	@apply flex-1;

	h2,
	h3 {
		@apply m-0;
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-bold);
		font-family: var(--font-sans);
	}
}

/* Close button */
.modal__close {
	@apply ml-4;
	@apply w-8 h-8;
	@apply flex items-center justify-center;
	@apply rounded-full;
	@apply text-gray-500 hover:text-gray-1000 dark:hover:text-gray-100;
	@apply hover:bg-gray-200 dark:hover:bg-gray-800;
	@apply transition-colors duration-200;
	@apply cursor-pointer;
	@apply border-none bg-transparent;
	@apply flex-shrink-0;
	font-size: var(--font-size-2xl);
	line-height: 1;
}

/* Body */
.modal__body {
	@apply px-6 py-4;
	@apply overflow-y-auto;
	@apply flex-1;

	p {
		font-family: var(--font-sans);
		font-size: var(--font-size-base);
		@apply mt-0;
	}

	p + p {
		@apply mt-4;
	}
}

/* Footer */
.modal__footer {
	@apply flex items-center justify-end gap-2;
	@apply px-6 py-4;
	@apply border-t border-gray-300 dark:border-gray-700;
}

/* Animations */
.modal[open] {
	animation: modal-slide-in 250ms ease-out;
}

.modal[open]::backdrop {
	animation: fade-in 200ms ease-out;
}

.modal--closing {
	animation: modal-slide-out 200ms ease-in;
}

.modal--closing::backdrop {
	animation: fade-out 200ms ease-in;
}

@keyframes fade-in {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes fade-out {
	from {
		opacity: 1;
	}
	to {
		opacity: 0;
	}
}

@keyframes modal-slide-in {
	from {
		opacity: 0;
		transform: translate(-50%, -50%) translateY(-20px) scale(0.95);
	}
	to {
		opacity: 1;
		transform: translate(-50%, -50%) translateY(0) scale(1);
	}
}

@keyframes modal-slide-out {
	from {
		opacity: 1;
		transform: translate(-50%, -50%) translateY(0) scale(1);
	}
	to {
		opacity: 0;
		transform: translate(-50%, -50%) translateY(20px) scale(0.95);
	}
}
```

### 3. Story Wrapper (Optional)

**File:** `/src/stories/ModalExample.svelte`

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';

	interface Props {
		children: Snippet;
		title?: Snippet;
		actions?: Snippet;
		size?: 'small' | 'medium' | 'large';
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
	}

	let { children, title, actions, size, closeOnBackdrop, closeOnEscape }: Props = $props();
	let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Open Modal</Button>

<Modal {open} onclose={() => (open = false)} {size} {title} {actions} {closeOnBackdrop} {closeOnEscape}>
	{@render children()}
</Modal>
```

### 4. Export Component

**File:** `/src/lib/index.ts`

Add:
```typescript
export { default as Modal } from './components/Modal.svelte';
```

### 5. Import Styles

**File:** `/src/styles/components/index.css`

Add:
```css
@import './modal.css';
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `Snippet` | required | Modal body content |
| `title` | `Snippet?` | - | Optional header title |
| `actions` | `Snippet?` | - | Optional footer actions |
| `open` | `boolean` | `false` | Controls modal visibility |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Modal width variant |
| `closeOnBackdrop` | `boolean` | `true` | Allow closing by clicking outside |
| `closeOnEscape` | `boolean` | `true` | Allow closing with ESC key |
| `onclose` | `() => void` | - | Callback when modal closes |

## Usage Examples

### Basic Usage

```svelte
<script>
	import { Modal, Button } from '$lib';
	let showModal = $state(false);
</script>

<Button onclick={() => (showModal = true)}>Open</Button>

<Modal open={showModal} onclose={() => (showModal = false)}>
	<p>Modal content goes here.</p>
</Modal>
```

### With Title and Actions

```svelte
<Modal open={showModal} onclose={() => (showModal = false)}>
	{#snippet title()}
		<h2>Confirm Delete</h2>
	{/snippet}

	<p>Are you sure you want to delete this item?</p>

	{#snippet actions()}
		<Button variant="ghost" onclick={() => (showModal = false)}>Cancel</Button>
		<Button onclick={handleDelete}>Delete</Button>
	{/snippet}
</Modal>
```

### Different Sizes

```svelte
<!-- Small modal for alerts -->
<Modal open={showAlert} size="small">
	{#snippet title()}
		<h2>Alert</h2>
	{/snippet}
	<p>This is an important message.</p>
</Modal>

<!-- Large modal for forms -->
<Modal open={showForm} size="large">
	{#snippet title()}
		<h2>Contact Form</h2>
	{/snippet}
	<form><!-- form content --></form>
</Modal>
```

### Prevent Backdrop Close

```svelte
<Modal open={showModal} closeOnBackdrop={false}>
	<p>You must use the close button or ESC key.</p>
</Modal>
```
