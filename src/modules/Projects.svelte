<script context='module'>
  import { transition } from './Transitions.svelte'
  const res = fetch('https://api.github.com/users/ThaUnknown/repos?sort=updated&direction=desc&per_page=100').then(async res => {
    return (await res.json()).sort((a, b) => b.stargazers_count - a.stargazers_count).filter(repo => !repo.fork)
  })
</script>

<div class='container'>
  <h1 class='font-weight-bold'>List of all my public projects</h1>
  <div class='content'>
    {#await res}
      <h1 class='font-weight-bold'>Loading...</h1>
    {:then repos}
      <div class='row py-20'>
        {#each repos as repo, i}
          {@const delay = 800 + i * 200}
          <div class='w-full col-lg-4'>
            <div class='card m-10 d-flex flex-column position-relative zoom pointer' on:click={() => { transition(repo.name) }} style:--delay='{delay}ms'>
              <h2 class='card-title pr-20 mb-0'><a href={repo.html_url}>{repo.name}</a></h2>
              <p class='text-muted h-full mb-0'>{repo.description ?? 'No description provided.'}</p>
              <div class='d-flex flex-column position-absolute top-0 right-0 p-15 text-muted'>
                <span class='pr-5'>
                  <svg viewBox='0 0 576 512'><path fill='currentColor' d='M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z' /></svg>
                  {repo.stargazers_count}
                </span>
                <span class='pr-5'>
                  <svg viewBox='0 0 384 512'><path fill='currentColor' d='M384 144c0-44.2-35.8-80-80-80s-80 35.8-80 80c0 36.4 24.3 67.1 57.5 76.8-.6 16.1-4.2 28.5-11 36.9-15.4 19.2-49.3 22.4-85.2 25.7-28.2 2.6-57.4 5.4-81.3 16.9v-144c32.5-10.2 56-40.5 56-76.3 0-44.2-35.8-80-80-80S0 35.8 0 80c0 35.8 23.5 66.1 56 76.3v199.3C23.5 365.9 0 396.2 0 432c0 44.2 35.8 80 80 80s80-35.8 80-80c0-34-21.2-63.1-51.2-74.6 3.1-5.2 7.8-9.8 14.9-13.4 16.2-8.2 40.4-10.4 66.1-12.8 42.2-3.9 90-8.4 118.2-43.4 14-17.4 21.1-39.8 21.6-67.9 31.6-10.8 54.4-40.7 54.4-75.9zM80 64c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16 7.2-16 16-16zm0 384c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm224-320c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16 7.2-16 16-16z' /></svg>
                  {repo.forks_count}
                </span>
              </div>
            </div>
          </div>
        {:else}
          <div class='d-flex flex-column align-items-center justify-content-center text-center w-full'>
            <h2 class='font-weight-semi-bold mb-10'>Ooops!</h2>
            <div>Looks like there's nothing here.</div>
          </div>
        {/each}
      </div>
    {/await}
  </div>
</div>

<style>
  svg {
    height: 1.2rem;
    width: 1.2rem;
  }
  .card {
    min-height: 15rem;
  }
  .zoom {
    transition: transform 0.3s ease;
  }
  .zoom:hover{
    transform: scale(1.1);
  }
  .card {
    opacity: 0;
    animation-name: load-in;
    animation-duration: .4s;
    animation-timing-function: ease;
    animation-iteration-count: 1;
    animation-delay: var(--delay);
    animation-fill-mode: forwards;
  }
  @keyframes load-in {
    from {
      opacity: 0;
      bottom: -1.2rem;
      transform: scale(0.95);
    }

    to {
      opacity: 1;
      bottom: 0;
      transform: scale(1);
    }
  }
</style>
