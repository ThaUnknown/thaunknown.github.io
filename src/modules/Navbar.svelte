<script>
  import { scrollContact } from './Footer.svelte'
  import { transition } from './Transitions.svelte'
  export let page = 'home'
</script>

{#if page !== 'home'}
  <nav class='navbar px-20'>
    <!-- Navbar brand -->
    <div class='navbar-brand pointer' on:click={() => transition('home')}>
      ThaUnknown
    </div>
    <ul class='navbar-nav ml-auto'> <!-- d-none = display: none, d-md-flex = display: flex on medium screens and up (width > 768px) -->
      <li class='nav-item' class:active={page === 'showcase'} on:click={() => transition('showcase')}>
        <div class='nav-link'>Showcase</div>
      </li>
      <li class='nav-item' class:active={page === 'projects'} on:click={() => transition('projects')}>
        <div class='nav-link'>Projects</div>
      </li>
      <li class='nav-item' on:click={scrollContact}>
        <div class='nav-link'>Contact</div>
      </li>
    </ul>
  </nav>
{/if}
