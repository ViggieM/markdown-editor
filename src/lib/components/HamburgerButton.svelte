<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		/**
		 * Controls the visual state and animation of the hamburger icon
		 */
		isOpen: boolean;
		/**
		 * Click handler for the button
		 */
		onclick?: () => void;
		/**
		 * Optional children content (typically not used for hamburger buttons)
		 */
		children?: Snippet;
	}

	let { isOpen = $bindable(), onclick, children, ...restProps }: Props = $props();
</script>

<button
	class="hamburger-button"
	class:hamburger-button--open={isOpen}
	{onclick}
	aria-label={isOpen ? 'Close menu' : 'Open menu'}
	aria-expanded={isOpen}
	type="button"
	{...restProps}
>
	<div class="hamburger-button__icon">
		<span class="hamburger-button__bar"></span>
		<span class="hamburger-button__bar"></span>
		<span class="hamburger-button__bar"></span>
	</div>
	{#if children}
		{@render children()}
	{/if}
</button>

<style>
	@reference '../../styles/global.css';

	.hamburger-button {
		@apply p-4 py-5;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-gray-800);
		border: none;
		cursor: pointer;
		transition: background-color 0.2s ease;
		position: relative;
	}

	.hamburger-button:hover {
		background: var(--color-orange-hover);
	}

	.hamburger-button:focus-visible {
		outline: 2px solid var(--color-orange);
		outline-offset: 2px;
	}

	/* Icon container */
	.hamburger-button__icon {
		@apply h-[14px] w-[16px] md:h-[18px] md:w-[30px];
		display: flex;
		flex-direction: column;
		gap: 4px;
		position: relative;
	}

	/* Individual bars */
	.hamburger-button__bar {
		@apply h-[2px] w-[23px] md:w-[30px];
		background: white;
		transition: all 0.3s ease;
		transform-origin: center;
		position: absolute;
		left: 0;
	}

	.hamburger-button__bar:nth-child(1) {
		top: 0;
	}

	.hamburger-button__bar:nth-child(2) {
		top: 50%;
		transform: translateY(-50%);
	}

	.hamburger-button__bar:nth-child(3) {
		bottom: 0;
	}

	/* Open state: transform to X */
	.hamburger-button--open .hamburger-button__bar:nth-child(1) {
		top: 50%;
		transform: translateY(-50%) rotate(45deg);
	}

	.hamburger-button--open .hamburger-button__bar:nth-child(2) {
		opacity: 0;
	}

	.hamburger-button--open .hamburger-button__bar:nth-child(3) {
		bottom: 50%;
		transform: translateY(50%) rotate(-45deg);
	}
</style>
