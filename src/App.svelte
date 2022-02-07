<script>
	import LandingCard from './modules/LandingCard.svelte';
</script>

<div class="page-wrapper">
	<div class="content-wrapper overflow-x-hidden">
		<LandingCard />
		<div class="d-flex w-full h-full bg-dark-light">test</div>
	</div>
</div>

<style>
	.content-wrapper {
		perspective: 1px;
		transform-style: preserve-3d;
	}
	:global(::-webkit-scrollbar) {
		display: none;
	}
</style>
