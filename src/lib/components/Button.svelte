<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue, HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		children: Snippet;
		variant?: 'primary' | 'ghost';
		size?: 'small' | 'medium';
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		onclick?: (event: MouseEvent) => void;
		class?: ClassValue;
	}

	const props: Props = $props();

	const variantClass = $derived(props.variant === 'ghost' ? 'btn-ghost' : 'btn-primary');
	const sizeClass = $derived(props.size === 'small' ? 'btn-sm' : '');
	const buttonClass = $derived(`btn ${variantClass} ${sizeClass}`.trim());
</script>

<button
	type={props.type}
	disabled={props.disabled}
	onclick={props.onclick}
	class={[buttonClass, props.class]}
>
	{@render props.children()}
</button>
