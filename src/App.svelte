<script context='module'>
  import './global.css'
  import 'quartermoon/css/quartermoon-variables.css'
  import Loader from './modules/Loader.svelte'
  import Transitions from './modules/Transitions.svelte'
  import Router from './modules/Router.svelte'
  import Navbar from './modules/Navbar.svelte'

</script>

<script>
  let page = location.search.replace('?', '') || 'home'

  $: history.replaceState(null, null, '?' + page)

  let container = null
</script>

<div class='page-wrapper bg-very-dark'>
  <Transitions bind:page {container}/>
  <Loader />
  <div class='content-wrapper h-full overflow-y-scroll' bind:this={container}>
    <Navbar {page} />
    <Router {page} />
  </div>
</div>

<style>
  * {
    scroll-behavior: smooth;
  }
  .content-wrapper {
    perspective: 400px;
    transform-style: preserve-3d;
  }
</style>
