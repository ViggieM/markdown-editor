<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		children: Snippet;
		variant?: 'primary' | 'secondary' | 'tertiary';
		size?: 'small' | 'medium' | 'large';
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
</script>

<button {type} {disabled} {onclick} {...rest}>
	{@render children()}
</button>
