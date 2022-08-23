<script context='module'>
  import { transition } from './Transitions.svelte'
  const projects = [
    {
      title: 'Miru',
      description: 'A simple to use, anime torrent streaming app. Allows you to watch any anime, real-time with no waiting for downloads, with friends, while synching all your progress with you anime list for free with no ads or limits.',
      image: 'https://raw.githubusercontent.com/ThaUnknown/miru/HEAD/docs/show.gif',
      tech: ['Svelte', 'Electron', 'Vite', 'GraphQL', 'WASM', 'Node.js', 'BitTorrent', 'WebRTC']
    },
    {
      title: 'PWA Haven',
      description: 'Progressive Web Apps which replace oversized native apps, with simple, lightweight browser based apps, which don\'t create copies of processes, but instead share one environment, which likely was already in-use by the user, for example browsing the web or reading articles, eliminating those duplicate processes.',
      image: 'https://raw.githubusercontent.com/ThaUnknown/pwa-haven/HEAD/docs/haven.png',
      tech: ['Svelte', 'Webpack', 'Rollup', 'WASM', 'PWA', 'WebRTC']
    },
    {
      title: 'Portfolio',
      description: 'Fully hardware accelerated portfolio, with fancy transitions and animations that don\'t use and hacky patches, styles or other shenanigans which slows down rendering.',
      image: './public/images/portfolio.webp',
      tech: ['Svelte', 'Rollup', 'WASM', 'three.js']
    }
  ]
</script>

<div class='container'>
  <div class='content'>
    {#each projects as { title, description, image, tech }, i}
      {@const delay = 800 + i * 500}
      <div class='featured h-400 d-flex d-md-grid position-relative animate' style:--delay='{delay}ms'>
        <div class='image z-0 pointer' on:click={() => { transition(title.toLowerCase()) }}>
          <img src={image} alt='preview' class='shadow-lg rounded img-cover w-full h-full'>
        </div>
        <div class='about z-10 position-absolute p-md-0 p-20 d-flex flex-column justify-content-center h-full'>
          <div class='text-primary font-weight-bold'>Featured Project</div>
          <div class='font-size-24 font-weight-bold text-white'>{title}</div>
          <div class='w-full my-20 p-20 bg-dark rounded shadow-lg'>{description}</div>
          <div class='text-monospace'>
            {#each tech as item, i}
              {@const smalldelay = delay + 80 * (i + 1)}
              <div class='px-10 py-5 d-inline-block animate' style:--delay='{smalldelay}ms'>{item}</div>
            {/each}
          </div>
          <div>
            <button class='btn btn-primary border mt-10' type='button' on:click={() => { transition(title.toLowerCase()) }}>About</button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .animate {
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
  .featured {
    gap: 10px;
    grid-template-columns: repeat(12, 1fr);
    margin-bottom: 15rem;
  }
  .featured:nth-of-type(2n+1) .about {
    grid-column: 7 / -1;
    text-align: right;
  }
  .featured .about {
    grid-area: 1 / 1 / -1 / 7;
  }
  .featured:nth-of-type(2n+1) .image {
    grid-column: 1 / 8;
  }

  .featured .image {
    grid-area: 1 / 6 / -1 / -1;
  }
  .image {
    filter: grayscale(100%) brightness(60%) blur(4px);
    transition: filter .2s ease
  }
  .image:hover {
    filter: none
  }
</style>
