<script context='module'>
  import Home from './Home.svelte'
  import Footer from './Footer.svelte'

  const pages = {
    home: Home
  }
</script>
<script>
  export let page = 'home'
</script>

<svelte:component this={pages[page]} />
<Footer />
