<script context='module'>
  import Home from './Home.svelte'
  import Showcase from './Showcase.svelte'
  import Footer from './Footer.svelte'
  import Project from './Project.svelte'
  import Projects from './Projects.svelte'

  const pages = {
    home: Home,
    showcase: Showcase,
    projects: Projects
  }
</script>
<script>
  export let page = 'home'
</script>

<svelte:component this={pages[page] || Project} {page} />
<Footer />
