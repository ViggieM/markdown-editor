<script lang="ts">
	interface Props {
		onclick?: () => void;
	}

	let { onclick }: Props = $props();
</script>

<button
	class="sidebar"
	onclick={onclick}
	aria-label="Open menu"
	aria-expanded="false"
	type="button"
>
	<svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<rect width="30" height="2" fill="white" />
		<rect y="9" width="30" height="2" fill="white" />
		<rect y="18" width="30" height="2" fill="white" />
	</svg>
</button>
