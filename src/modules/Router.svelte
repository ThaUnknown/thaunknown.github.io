<script context='module'>
  import Home from './Home.svelte'
  import Showcase from './Showcase.svelte'
  import Footer from './Footer.svelte'

  const pages = {
    home: Home,
    showcase: Showcase
  }
</script>
<script>
  export let page = 'home'
</script>

<svelte:component this={pages[page]} />
<Footer />
