# Modal Component Tutorial - Step by Step Implementation

This tutorial will guide you through building a Modal component using the HTML `<dialog>` element. We'll build it incrementally, testing each step along the way.

## Story Pattern

This tutorial uses a simplified story pattern with:
- **ModalExample wrapper**: A component that manages modal state internally for simpler stories
- **asChild prop**: Storybook's `asChild` pattern for cleaner story composition
- **Two approaches**: Simple stories use ModalExample, complex stories (with forms, custom state) use Modal directly

## Prerequisites

- Project is running (`pnpm dev` or Storybook `pnpm storybook`)
- Understanding of Svelte 5 runes (`$state`, `$props`, `$derived`, `$effect`)
- Familiarity with TypeScript and snippets
- Understanding of Storybook's `asChild` pattern

---

## Step 1: Create Basic Modal Structure

**Goal**: Create the minimal Modal component with a dialog element and basic props.

### 1.1 Create the component file

Create: `/src/lib/components/Modal.svelte`

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		open?: boolean;
	}

	let { children, open = false }: Props = $props();

	let dialogElement: HTMLDialogElement;
</script>

<dialog bind:this={dialogElement}>
	<div class="modal__content">
		<div class="modal__body">
			{@render children()}
		</div>
	</div>
</dialog>

<style>
	dialog {
		border: 2px solid black;
		padding: 1rem;
		border-radius: 8px;
	}

	.modal__content {
		min-width: 300px;
	}

	.modal__body {
		padding: 1rem;
	}
</style>
```

### 1.2 Export the component

Edit: `/src/lib/index.ts`

Add this line:
```typescript
export { default as Modal } from './components/Modal.svelte';
```

### 1.3 Create a wrapper component for stories

Create: `/src/stories/ModalExample.svelte`

This component manages the modal state internally so stories can be simpler.

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
	}

	let { children, title, actions, size }: Props = $props();
	let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Open Modal</Button>

<Modal {open} onclose={() => (open = false)} {size} {title} {actions}>
	{@render children()}
</Modal>
```

### 1.4 Create a test story

Create: `/src/stories/Modal.stories.svelte`

```svelte
<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ModalExample from './ModalExample.svelte';

	const { Story } = defineMeta({
		title: 'Components/Modal',
		component: ModalExample,
		tags: ['autodocs']
	});
</script>

<Story name="Basic" asChild>
	<ModalExample>
		<p>This is just a modal without a header and title</p>
	</ModalExample>
</Story>
```

### ✅ Validation Step 1

1. Run Storybook: `pnpm storybook`
2. Navigate to "Components/Modal" → "Basic"
3. Click the "Open Modal" button
4. **Expected**: Nothing visible happens yet (we haven't wired up the open logic)
5. **Check**: No console errors

---

## Step 2: Wire Up Open/Close Logic

**Goal**: Make the modal actually show when `open` is true.

### 2.1 Add the effect to sync state

Edit: `/src/lib/components/Modal.svelte`

Update the `<script>` section:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		open?: boolean;
	}

	let { children, open = false }: Props = $props();

	let dialogElement: HTMLDialogElement;

	// Sync the open prop with the dialog element
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
</script>
```

### 2.2 Add a close button

Update the template section:

```svelte
<dialog bind:this={dialogElement}>
	<div class="modal__content">
		<div class="modal__body">
			{@render children()}
		</div>
		<button onclick={() => (open = false)}>Close</button>
	</div>
</dialog>
```

**Wait!** This won't work because we can't reassign `open` (it's a prop). We need to add a callback.

### 2.3 Add close callback

Update the Props interface:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		open?: boolean;
		onclose?: () => void;
	}

	let { children, open = false, onclose }: Props = $props();

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
</script>

<dialog bind:this={dialogElement}>
	<div class="modal__content">
		<div class="modal__body">
			{@render children()}
		</div>
		<button onclick={handleClose}>Close</button>
	</div>
</dialog>

<!-- Keep the same style block -->
```

### 2.4 Update the story to test close behavior

The story remains simple - ModalExample handles the state:

```svelte
<Story name="Basic" asChild>
	<ModalExample>
		<p>Hello! This is a basic modal.</p>
	</ModalExample>
</Story>
```

### ✅ Validation Step 2

1. Refresh Storybook
2. Click "Open Modal"
3. **Expected**: Modal appears with black border, shows content and close button
4. Click "Close" button
5. **Expected**: Modal disappears
6. Click "Open Modal" again
7. **Expected**: Modal appears again
8. **Check**: The backdrop (darkened area behind modal) should be visible

---

## Step 3: Add Backdrop Click to Close

**Goal**: Close the modal when clicking outside of it.

### 3.1 Add backdrop click handler

Edit: `/src/lib/components/Modal.svelte`

Add this function after `handleClose`:

```typescript
function handleBackdropClick(event: MouseEvent) {
	// Get the bounding box of the modal content
	const rect = dialogElement.getBoundingClientRect();

	// Check if click was outside the content box
	const clickedOutside =
		event.clientX < rect.left ||
		event.clientX > rect.right ||
		event.clientY < rect.top ||
		event.clientY > rect.bottom;

	if (clickedOutside) {
		handleClose();
	}
}
```

Update the `<dialog>` element:

```svelte
<dialog bind:this={dialogElement} onclick={handleBackdropClick}>
	<div class="modal__content" onclick={(e) => e.stopPropagation()}>
		<div class="modal__body">
			{@render children()}
		</div>
		<button onclick={handleClose}>Close</button>
	</div>
</dialog>
```

Note: We added `onclick={(e) => e.stopPropagation()}` to the content div to prevent clicks inside from bubbling up.

### ✅ Validation Step 3

1. Refresh Storybook
2. Open the modal
3. Click outside the modal (on the dark backdrop)
4. **Expected**: Modal closes
5. Open modal again
6. Click inside the modal content
7. **Expected**: Modal stays open
8. Click the close button
9. **Expected**: Modal closes

---

## Step 4: Add ESC Key Support

**Goal**: Allow ESC key to close the modal (this is built into `<dialog>`!).

### 4.1 Add close event handler

Edit: `/src/lib/components/Modal.svelte`

The `<dialog>` element fires a `close` event when ESC is pressed. Update the dialog element:

```svelte
<dialog bind:this={dialogElement} onclick={handleBackdropClick} onclose={handleClose}>
	<div class="modal__content" onclick={(e) => e.stopPropagation()}>
		<div class="modal__body">
			{@render children()}
		</div>
		<button onclick={handleClose}>Close</button>
	</div>
</dialog>
```

That's it! The native dialog handles ESC automatically.

### ✅ Validation Step 4

1. Refresh Storybook
2. Open the modal
3. Press ESC key
4. **Expected**: Modal closes
5. Open modal, press ESC multiple times
6. **Expected**: Modal closes on first press, subsequent presses do nothing

---

## Step 5: Add Title and Actions Snippets

**Goal**: Make the modal more flexible with optional header and footer.

### 5.1 Update Props interface

Edit: `/src/lib/components/Modal.svelte`

```typescript
interface Props {
	children: Snippet;
	title?: Snippet;
	actions?: Snippet;
	open?: boolean;
	onclose?: () => void;
}

let { children, title, actions, open = false, onclose }: Props = $props();
```

### 5.2 Update template structure

```svelte
<dialog bind:this={dialogElement} onclick={handleBackdropClick} onclose={handleClose}>
	<div class="modal__content" onclick={(e) => e.stopPropagation()}>
		{#if title}
			<header class="modal__header">
				<div class="modal__title">
					{@render title()}
				</div>
				<button class="modal__close" onclick={handleClose}>×</button>
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

### 5.3 Update styles

Add to the `<style>` block:

```svelte
<style>
	dialog {
		border: 2px solid black;
		padding: 0;
		border-radius: 8px;
		min-width: 400px;
	}

	.modal__content {
		display: flex;
		flex-direction: column;
	}

	.modal__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		border-bottom: 1px solid #ccc;
	}

	.modal__title {
		flex: 1;
		font-weight: bold;
		font-size: 1.25rem;
	}

	.modal__close {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		margin-left: 1rem;
	}

	.modal__close:hover {
		background-color: #f0f0f0;
		border-radius: 4px;
	}

	.modal__body {
		padding: 1rem;
		flex: 1;
		overflow-y: auto;
	}

	.modal__footer {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.5rem;
		padding: 1rem;
		border-top: 1px solid #ccc;
	}
</style>
```

### 5.4 Create new stories

Edit: `/src/stories/Modal.stories.svelte`

Add these stories using the asChild pattern:

```svelte
<Story name="With Title" asChild>
	<ModalExample>
		{#snippet title()}
			<h2 style="margin: 0;">Modal Title</h2>
		{/snippet}
		<p>Hello! This is a modal with a title.</p>
	</ModalExample>
</Story>

<Story name="With Actions" asChild>
	<ModalExample>
		{#snippet title()}
			<h2 style="margin: 0;">Modal Title</h2>
		{/snippet}
		<p>Are you sure you want to proceed?</p>
		{#snippet actions()}
			<Button variant="ghost" onclick={() => {}}>Cancel</Button>
			<Button onclick={() => {}}>Confirm</Button>
		{/snippet}
	</ModalExample>
</Story>
```

### ✅ Validation Step 5

1. Refresh Storybook
2. Check "Basic" story - should still work without title/actions
3. Check "With Title" story - should show header with × button
4. Check "With Actions" story - should show footer with buttons
5. Click × button in header - modal should close
6. Click Cancel/Confirm in footer - modal should close
7. **Check**: Header and footer have border separators

---

## Step 6: Move Styles to External CSS File

**Goal**: Follow project convention of using external CSS files with Tailwind.

### 6.1 Create CSS file

Create: `/src/styles/components/modal.css`

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
```

### 6.2 Import the CSS file

Edit: `/src/styles/components/index.css`

Add this line with the other imports:

```css
@import './modal.css';
```

### 6.3 Update Modal component to use CSS classes

Edit: `/src/lib/components/Modal.svelte`

Remove the entire `<style>` block and update the template to use class names:

```svelte
<dialog bind:this={dialogElement} onclick={handleBackdropClick} onclose={handleClose} class="modal">
	<div class="modal__content" onclick={(e) => e.stopPropagation()}>
		{#if title}
			<header class="modal__header">
				<div class="modal__title">
					{@render title()}
				</div>
				<button class="modal__close" onclick={handleClose}>×</button>
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

### ✅ Validation Step 6

1. Refresh Storybook
2. Test all three stories (Basic, With Title, With Actions)
3. **Expected**: Everything looks better with proper spacing, colors, dark mode support
4. Toggle dark mode (if available in your app)
5. **Expected**: Modal adapts to dark mode with proper colors
6. **Check**: Backdrop is now darker and more visible

---

## Step 7: Add Size Variants

**Goal**: Support different modal sizes.

### 7.1 Add size prop

Edit: `/src/lib/components/Modal.svelte`

Update Props:

```typescript
interface Props {
	children: Snippet;
	title?: Snippet;
	actions?: Snippet;
	open?: boolean;
	size?: 'small' | 'medium' | 'large';
	onclose?: () => void;
}

let { children, title, actions, open = false, size = 'medium', onclose }: Props = $props();
```

Add derived class:

```typescript
const modalClass = $derived(`modal modal--${size}`);
```

Update the dialog element:

```svelte
<dialog bind:this={dialogElement} onclick={handleBackdropClick} onclose={handleClose} class={modalClass}>
```

### 7.2 Add size styles

Edit: `/src/styles/components/modal.css`

Add after `.modal__content`:

```css
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
```

### 7.3 Add size stories

Edit: `/src/stories/Modal.stories.svelte`

Update the defineMeta to include ModalExample and argTypes:

```svelte
const { Story } = defineMeta({
	title: 'Components/Modal',
	component: ModalExample,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large']
		}
	}
});
```

Add new stories using asChild:

```svelte
<Story name="Small Size" asChild>
	<ModalExample size="small">
		{#snippet title()}
			<h2 style="margin: 0;">Small Modal</h2>
		{/snippet}
		<p>This is a small modal, perfect for alerts.</p>
		{#snippet actions()}
			<Button onclick={() => {}}>OK</Button>
		{/snippet}
	</ModalExample>
</Story>

<Story name="Large Size" asChild>
	<ModalExample size="large">
		{#snippet title()}
			<h2 style="margin: 0;">Large Modal</h2>
		{/snippet}
		<p>This is a large modal with more content space.</p>
		<p>Perfect for forms or detailed information.</p>
		<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
		{#snippet actions()}
			<Button onclick={() => {}}>Close</Button>
		{/snippet}
	</ModalExample>
</Story>
```

### ✅ Validation Step 7

1. Refresh Storybook
2. Check "Small Size" story - modal should be narrow
3. Check "Large Size" story - modal should be wide
4. Check "With Actions" story (default medium) - should be in-between
5. **Check**: All modals are still centered on screen

---

## Step 8: Add Animations

**Goal**: Smooth fade-in and slide-up animation when opening/closing.

### 8.1 Add animation CSS

Edit: `/src/styles/components/modal.css`

Add at the end of the file:

```css
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

### 8.2 Update close logic for animation

Edit: `/src/lib/components/Modal.svelte`

Replace the `handleClose` function:

```typescript
async function handleClose() {
	if (!dialogElement.open) return;

	// Add closing class for animation
	dialogElement.classList.add('modal--closing');

	// Wait for animation to complete
	await new Promise((resolve) => setTimeout(resolve, 200));

	// Remove closing class
	dialogElement.classList.remove('modal--closing');

	// Call the close callback
	onclose?.();
}
```

### ✅ Validation Step 8

1. Refresh Storybook
2. Open any modal
3. **Expected**: Modal slides up from bottom and fades in smoothly
4. Close the modal (any method: button, backdrop, ESC)
5. **Expected**: Modal slides down and fades out smoothly
6. **Check**: Animation is smooth, not janky
7. Open and close rapidly - animations should complete properly

---

## Step 9: Add Configurable Behavior Props

**Goal**: Allow controlling backdrop click and ESC key behavior.

### 9.1 Add behavior props

Edit: `/src/lib/components/Modal.svelte`

Update Props:

```typescript
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
```

### 9.2 Update handlers

Update `handleBackdropClick`:

```typescript
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
```

Update the dialog's `onclose` handler:

```svelte
<dialog
	bind:this={dialogElement}
	onclick={handleBackdropClick}
	onclose={(e) => {
		if (!closeOnEscape) {
			e.preventDefault();
			return;
		}
		handleClose();
	}}
	class={modalClass}
>
```

### 9.3 Update ModalExample to support behavior props

First, update ModalExample to accept and pass through the behavior props:

Edit: `/src/stories/ModalExample.svelte`

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

### 9.4 Add test story

Edit: `/src/stories/Modal.stories.svelte`

Update argTypes:

```svelte
const { Story } = defineMeta({
	title: 'Components/Modal',
	component: ModalExample,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large']
		},
		closeOnBackdrop: { control: 'boolean' },
		closeOnEscape: { control: 'boolean' }
	}
});
```

Add story using asChild:

```svelte
<Story name="No Backdrop Close" asChild>
	<ModalExample closeOnBackdrop={false}>
		{#snippet title()}
			<h2 style="margin: 0;">Can't Close on Backdrop</h2>
		{/snippet}
		<p>This modal requires explicit close action using the button or ESC key.</p>
		<p style="margin-top: 0.5rem; font-size: 0.875rem; color: #666;">
			Try clicking outside - modal won't close
		</p>
		{#snippet actions()}
			<Button onclick={() => {}}>Close</Button>
		{/snippet}
	</ModalExample>
</Story>
```

### ✅ Validation Step 9

1. Refresh Storybook
2. Open "No Backdrop Close" story
3. Click outside the modal
4. **Expected**: Modal stays open
5. Press ESC
6. **Expected**: Modal closes
7. Open modal again, click Close button
8. **Expected**: Modal closes
9. Test other stories - backdrop click should still work

---

## Step 10: Add Accessibility Features

**Goal**: Improve accessibility with ARIA attributes and focus management.

### 10.1 Add ARIA attributes

Edit: `/src/lib/components/Modal.svelte`

Update the dialog element:

```svelte
<dialog
	bind:this={dialogElement}
	onclick={handleBackdropClick}
	onclose={(e) => {
		if (!closeOnEscape) {
			e.preventDefault();
			return;
		}
		handleClose();
	}}
	class={modalClass}
	aria-labelledby={title ? 'modal-title' : undefined}
	aria-describedby="modal-description"
	aria-modal="true"
>
	<div class="modal__content" onclick={(e) => e.stopPropagation()}>
		{#if title}
			<header class="modal__header">
				<div id="modal-title" class="modal__title">
					{@render title()}
				</div>
				<button class="modal__close" onclick={handleClose} aria-label="Close modal">×</button>
			</header>
		{/if}

		<div id="modal-description" class="modal__body">
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

### 10.2 Add focus restoration

Add state for tracking trigger element:

```typescript
let dialogElement: HTMLDialogElement;
let triggerElement: HTMLElement | null = null;
```

Add focus restoration to close handler:

```typescript
async function handleClose() {
	if (!dialogElement.open) return;

	dialogElement.classList.add('modal--closing');
	await new Promise((resolve) => setTimeout(resolve, 200));
	dialogElement.classList.remove('modal--closing');

	// Restore focus to trigger element
	if (triggerElement) {
		triggerElement.focus();
		triggerElement = null;
	}

	onclose?.();
}
```

Update the effect to capture trigger element:

```typescript
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
```

### ✅ Validation Step 10

1. Refresh Storybook
2. Tab to "Open Modal" button using keyboard
3. Press Enter to open modal
4. **Expected**: Focus moves into modal
5. Tab through modal elements
6. **Expected**: Focus stays within modal (native dialog behavior)
7. Press ESC or click Close
8. **Expected**: Focus returns to the "Open Modal" button
9. **Check with screen reader** (optional): Modal title is announced

---

## Step 11: Add Complete Example Stories

**Goal**: Create comprehensive examples for all common use cases.

**Note**: For simple examples, we can use ModalExample with asChild. For more complex stories that need custom logic (like tracking confirmation results or form state), we'll use the traditional Story approach without asChild.

### 11.1 Add complete stories

Edit: `/src/stories/Modal.stories.svelte`

Add these stories:

```svelte
<!-- Simple examples using asChild pattern -->
<Story name="Alert Modal" asChild>
	<ModalExample size="small">
		{#snippet title()}
			<h2 style="margin: 0;">⚠️ Alert</h2>
		{/snippet}
		<p>This is an important message that requires your attention.</p>
		{#snippet actions()}
			<Button onclick={() => {}}>OK</Button>
		{/snippet}
	</ModalExample>
</Story>

<!-- Complex examples that need custom state management -->
<Story name="Confirmation Modal">
	<script>
		import Modal from '$lib/components/Modal.svelte';

		let open = $state(false);
		let result = $state('');

		function handleConfirm() {
			result = 'Confirmed!';
			open = false;
		}

		function handleCancel() {
			result = 'Cancelled';
			open = false;
		}
	</script>

	<div>
		<Button onclick={() => (open = true)}>Delete Item</Button>
		{#if result}
			<p style="margin-top: 0.5rem; color: #666;">Result: {result}</p>
		{/if}
	</div>

	<Modal {open} onclose={handleCancel} size="small">
		{#snippet title()}
			<h2 style="margin: 0;">Confirm Delete</h2>
		{/snippet}
		<p>Are you sure you want to delete this item? This action cannot be undone.</p>
		{#snippet actions()}
			<Button variant="ghost" onclick={handleCancel}>Cancel</Button>
			<Button onclick={handleConfirm}>Delete</Button>
		{/snippet}
	</Modal>
</Story>

<Story name="Form Modal">
	<script>
		import Modal from '$lib/components/Modal.svelte';

		let open = $state(false);
		let formData = $state({ name: '', email: '' });

		function handleSubmit(e: Event) {
			e.preventDefault();
			console.log('Form submitted:', formData);
			open = false;
		}
	</script>

	<Button onclick={() => (open = true)}>Open Form</Button>

	<Modal {open} onclose={() => (open = false)} size="medium">
		{#snippet title()}
			<h2 style="margin: 0;">Contact Form</h2>
		{/snippet}

		<form id="contact-form" onsubmit={handleSubmit}>
			<div style="margin-bottom: 1rem;">
				<label
					for="name"
					style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-family: var(--font-sans);"
				>
					Name
				</label>
				<input
					id="name"
					type="text"
					bind:value={formData.name}
					style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; font-family: var(--font-sans);"
					required
				/>
			</div>
			<div>
				<label
					for="email"
					style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-family: var(--font-sans);"
				>
					Email
				</label>
				<input
					id="email"
					type="email"
					bind:value={formData.email}
					style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; font-family: var(--font-sans);"
					required
				/>
			</div>
		</form>

		{#snippet actions()}
			<Button variant="ghost" onclick={() => (open = false)}>Cancel</Button>
			<Button type="submit" form="contact-form">Submit</Button>
		{/snippet}
	</Modal>
</Story>

<!-- Simple example using asChild -->
<Story name="Long Content" asChild>
	<ModalExample size="medium">
		{#snippet title()}
			<h2 style="margin: 0;">Terms and Conditions</h2>
		{/snippet}

		{#each Array(20) as _, i}
			<p>
				Section {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
				exercitation ullamco laboris.
			</p>
		{/each}

		{#snippet actions()}
			<Button variant="ghost" onclick={() => {}}>Decline</Button>
			<Button onclick={() => {}}>Accept</Button>
		{/snippet}
	</ModalExample>
</Story>
```

### ✅ Validation Step 11

1. Refresh Storybook
2. Test **Alert Modal** - simple message with OK button
3. Test **Confirmation Modal** - shows result after confirm/cancel
4. Test **Form Modal** - check console for form submission
5. Test **Long Content** - body should scroll, header/footer stay fixed
6. **Check**: All modals look polished and professional

---

## Step 12: Final Polish and Testing

**Goal**: Add final touches and comprehensive testing.

### 12.1 Add complete component code

Here's your final `/src/lib/components/Modal.svelte`:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		title?: Snippet;
		actions?: Snippet;
		open?: boolean;
		size?: 'small' | 'medium' | 'large';
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		onclose?: () => void;
		onopen?: () => void;
	}

	let {
		children,
		title,
		actions,
		open = false,
		size = 'medium',
		closeOnBackdrop = true,
		closeOnEscape = true,
		onclose,
		onopen
	}: Props = $props();

	let dialogElement: HTMLDialogElement;
	let triggerElement: HTMLElement | null = null;

	const modalClass = $derived(`modal modal--${size}`);

	$effect(() => {
		if (!dialogElement) return;

		if (open) {
			if (!dialogElement.open) {
				triggerElement = document.activeElement as HTMLElement;
				dialogElement.showModal();
				onopen?.();
			}
		} else {
			if (dialogElement.open) {
				dialogElement.close();
			}
		}
	});

	async function handleClose() {
		if (!dialogElement.open) return;

		dialogElement.classList.add('modal--closing');
		await new Promise((resolve) => setTimeout(resolve, 200));
		dialogElement.classList.remove('modal--closing');

		if (triggerElement) {
			triggerElement.focus();
			triggerElement = null;
		}

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
	bind:this={dialogElement}
	onclick={handleBackdropClick}
	onclose={(e) => {
		if (!closeOnEscape) {
			e.preventDefault();
			return;
		}
		handleClose();
	}}
	class={modalClass}
	aria-labelledby={title ? 'modal-title' : undefined}
	aria-describedby="modal-description"
	role="dialog"
	aria-modal="true"
>
	<div class="modal__content" onclick={(e) => e.stopPropagation()}>
		{#if title}
			<header class="modal__header">
				<div id="modal-title" class="modal__title">
					{@render title()}
				</div>
				<button class="modal__close" onclick={handleClose} aria-label="Close modal">×</button>
			</header>
		{/if}

		<div id="modal-description" class="modal__body">
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

### 12.2 Complete Testing Checklist

Test each item and check it off:

**Basic Functionality:**
- [ ] Modal opens when open prop is true
- [ ] Modal closes when open prop is false
- [ ] Close button (×) works
- [ ] Backdrop click closes modal (when enabled)
- [ ] ESC key closes modal (when enabled)

**Behavior Props:**
- [ ] closeOnBackdrop={false} prevents backdrop close
- [ ] closeOnEscape={false} prevents ESC close
- [ ] onclose callback fires when modal closes
- [ ] onopen callback fires when modal opens

**Size Variants:**
- [ ] Small size renders correctly (narrow)
- [ ] Medium size renders correctly (default)
- [ ] Large size renders correctly (wide)

**Content Flexibility:**
- [ ] Works without title (no header shown)
- [ ] Works without actions (no footer shown)
- [ ] Works with only children snippet
- [ ] All three snippets work together

**Animations:**
- [ ] Opening animation plays smoothly
- [ ] Closing animation plays smoothly
- [ ] Backdrop fades in/out
- [ ] No animation jank or flash

**Accessibility:**
- [ ] Focus moves into modal when opened
- [ ] Tab key cycles through modal elements only
- [ ] Focus returns to trigger button when closed
- [ ] Close button has aria-label
- [ ] Modal has proper ARIA attributes
- [ ] Screen reader announces modal (optional test)

**Visual:**
- [ ] Backdrop is dark and semi-transparent
- [ ] Modal is centered on screen
- [ ] Header has bottom border (when present)
- [ ] Footer has top border (when present)
- [ ] Close button (×) has hover effect
- [ ] Dark mode works correctly

**Edge Cases:**
- [ ] Long content scrolls properly (header/footer stay visible)
- [ ] Multiple rapid open/close cycles work
- [ ] Clicking modal content doesn't close it
- [ ] Form submission works (Form Modal story)

### 12.3 Usage Patterns

There are two ways to use Modal in your application:

#### Option 1: Using ModalExample (recommended for simple cases)

For simple modals where you just need to show content with optional title and actions:

```svelte
<script>
	import ModalExample from './ModalExample.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<!-- In Storybook stories -->
<Story name="My Modal" asChild>
	<ModalExample>
		{#snippet title()}
			<h2 style="margin: 0;">My Modal</h2>
		{/snippet}
		<p>Modal content goes here.</p>
		{#snippet actions()}
			<Button onclick={() => {}}>Close</Button>
		{/snippet}
	</ModalExample>
</Story>
```

#### Option 2: Using Modal directly (for complex logic)

For modals that need custom state management, form handling, or result tracking:

```svelte
<script>
	import { Modal, Button } from '$lib';

	let showModal = $state(false);
</script>

<Button onclick={() => (showModal = true)}>Open Modal</Button>

<Modal open={showModal} onclose={() => (showModal = false)}>
	{#snippet title()}
		<h2>My Modal</h2>
	{/snippet}

	<p>Modal content goes here.</p>

	{#snippet actions()}
		<Button onclick={() => (showModal = false)}>Close</Button>
	{/snippet}
</Modal>
```

---

## 🎉 Congratulations!

You've successfully built a complete, production-ready Modal component with:

✅ Native `<dialog>` element with built-in accessibility
✅ Flexible content composition via snippets
✅ Smooth animations
✅ Multiple size variants
✅ Configurable behavior (backdrop click, ESC key)
✅ Focus management and restoration
✅ Dark mode support
✅ Comprehensive Storybook documentation

### Next Steps (Optional Enhancements)

If you want to extend the Modal further:

1. **Add $bindable support** for two-way binding: `bind:open`
2. **Prevent body scroll** when modal is open
3. **Stacking support** for multiple modals
4. **Custom animation** prop to override default animations
5. **Mobile fullscreen** mode for small viewports

### Troubleshooting

**Modal doesn't appear?**
- Check that `open` state is being set to `true`
- Check browser console for errors
- Verify CSS file is imported in `index.css`

**Animations not working?**
- Clear browser cache
- Check that `modal.css` has the @keyframes rules
- Verify the closing class is being added/removed

**Focus not trapped?**
- This is native browser behavior - ensure `.showModal()` is being called
- Check that dialog element is bound correctly

**Dark mode not working?**
- Verify your theme toggle is working
- Check that CSS variables are defined in your global styles

---

## Summary of Files

**Created:**
- `/src/lib/components/Modal.svelte` - Main Modal component
- `/src/styles/components/modal.css` - Component styles
- `/src/stories/ModalExample.svelte` - Wrapper component for simple stories (manages state internally)
- `/src/stories/Modal.stories.svelte` - Storybook stories using both asChild and traditional patterns

**Modified:**
- `/src/lib/index.ts` - Added Modal export
- `/src/styles/components/index.css` - Added modal.css import

## Key Patterns

**Simple Stories (recommended):**
```svelte
<Story name="Example" asChild>
  <ModalExample>
    <p>Content</p>
  </ModalExample>
</Story>
```

**Complex Stories (when needed):**
```svelte
<Story name="Example">
  <script>
    import Modal from '$lib/components/Modal.svelte';
    let open = $state(false);
  </script>

  <Button onclick={() => (open = true)}>Open</Button>
  <Modal {open} onclose={() => (open = false)}>
    <p>Content</p>
  </Modal>
</Story>
```

You now have a fully functional Modal component! 🚀
