<script lang="ts">
	interface Props {
		isMenuOpen: boolean;
	}

	let { isMenuOpen = $bindable() }: Props = $props();
</script>

<aside class="sidebar" class:sidebar--open={isMenuOpen}>
	<nav class="sidebar__nav">
		<h2 class="sidebar__title">My Documents</h2>
		<ul class="sidebar__list">
			<li class="sidebar__item">
				<button class="sidebar__button">welcome.md</button>
			</li>
		</ul>
		<button class="sidebar__new-document">+ New Document</button>
	</nav>
</aside>

<style>
	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		width: 250px;
		height: 100vh;
		background: var(--color-gray-900);
		transition: transform 0.3s ease;
		z-index: 100;
		transform: translateX(-100%);
	}

	.sidebar--open {
		transform: translateX(0);
	}

	.sidebar__nav {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 1.5rem 1rem;
	}

	.sidebar__title {
		color: var(--color-gray-400);
		font-size: 0.875rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 1.5rem;
	}

	.sidebar__list {
		list-style: none;
		padding: 0;
		margin: 0 0 auto 0;
		flex: 1;
	}

	.sidebar__item {
		margin-bottom: 0.5rem;
	}

	.sidebar__button {
		width: 100%;
		padding: 0.75rem 1rem;
		background: transparent;
		border: none;
		color: var(--color-gray-100);
		text-align: left;
		cursor: pointer;
		border-radius: 0.25rem;
		transition: background-color 0.2s ease;
		font-size: 0.9375rem;
	}

	.sidebar__button:hover {
		background: var(--color-gray-800);
	}

	.sidebar__new-document {
		width: 100%;
		padding: 0.75rem 1rem;
		background: var(--color-orange);
		border: none;
		color: white;
		cursor: pointer;
		border-radius: 0.25rem;
		font-weight: 500;
		transition: background-color 0.2s ease;
	}

	.sidebar__new-document:hover {
		background: var(--color-orange-hover);
	}
</style>
