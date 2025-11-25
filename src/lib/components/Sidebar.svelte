<script lang="ts">
	interface Props {
		isMenuOpen: boolean;
	}

	let { isMenuOpen = $bindable() }: Props = $props();
</script>

<aside class="sidebar" class:sidebar--open={isMenuOpen}>
	<nav class="sidebar__nav">
		<header class="sidebar__header">
			<div class="sidebar__logo">MARKDOWN</div>
			<div class="sidebar__title">My Documents</div>
			<button class="sidebar__new-document">+ New Document</button>
		</header>

		<ul class="sidebar__list">
			<li class="sidebar__item">
				<button class="sidebar__button">welcome.md</button>
			</li>
		</ul>
	</nav>
</aside>
