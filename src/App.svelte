<script>
  import LandingCard from './modules/LandingCard.svelte'
  import Content from './modules/Content.svelte'
</script>

<div class="page-wrapper">
  <div class="content-wrapper overflow-x-hidden">
    <LandingCard />
    <div class="d-flex w-full bg-dark-light">
      <div class="container my-20 py-20">
        <Content />
      </div>
    </div>
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
  :global(.pointer) {
    cursor: pointer;
  }
</style>
