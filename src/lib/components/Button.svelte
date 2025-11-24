<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		children: Snippet;
		variant?: 'primary' | 'ghost';
		size?: 'small' | 'medium';
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		onclick?: (event: MouseEvent) => void;
	}

	let {
		children,
		variant = 'primary',
		size = 'medium',
		disabled = false,
		type = 'button',
		onclick,
		...rest
	}: Props = $props();

	const variantClass = $derived(variant === 'ghost' ? 'btn-ghost' : 'btn-primary');
	const sizeClass = $derived(size === 'small' ? 'btn-sm' : '');
	const buttonClass = $derived(`${variantClass} ${sizeClass}`.trim());
</script>

<button {type} {disabled} {onclick} class={buttonClass} {...rest}>
	{@render children()}
</button>
