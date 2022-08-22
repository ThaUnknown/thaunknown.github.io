<script context='module'>
  import 'quartermoon/css/quartermoon-variables.css'
  import Loader from './modules/Loader.svelte'
  import Transitions from './modules/Transitions.svelte'
  import Router from './modules/Router.svelte'
</script>

<script>
  let page = 'home'
</script>

<div class='page-wrapper bg-very-dark'>
  <Transitions bind:page />
  <Loader />
  <div class='content-wrapper h-full overflow-y-scroll'>
    <Router {page} />
  </div>
</div>

<style>
  :global(.pointer) {
    cursor: pointer;
  }
  * {
    scroll-behavior: smooth;
  }
  :root {
    --dark-color-dim: #000 !important;
  }
  :global(::-webkit-scrollbar) {
    display: none;
  }
  .content-wrapper {
    perspective: 400px;
    transform-style: preserve-3d;
  }
</style>
