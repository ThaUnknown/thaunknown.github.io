<script context='module'>
  import { scrollContact } from './Footer.svelte'
  import { onDestroy, onMount } from 'svelte'
  import { transition } from './Transitions.svelte'
  let about
  // const icons = {
  //   // sorted: web, non-web
  //   // languages
  //   JavaScript: 'js',
  //   NodeJS: 'nodejs',
  //   Svelte: 'svelte',
  //   WebAssembly: 'wasm', // technology?
  //   'C++': 'c++',
  //   // "containers"
  //   ProgressiveWebApps: 'pwa',
  //   Electron: 'electron',
  //   Chromium: 'chromium',
  //   // technologies
  //   GraphQL: 'graphql',
  //   Emscripten: 'ems',
  //   WebRTC: 'webrtc',
  //   Canvas: 'canvas',
  //   // Matroska: 'mkv',
  //   BitTorrent: 'bittorrent',
  //   // tools
  //   Vite: 'vite',
  //   Webpack: 'webpack',
  //   Git: 'git',
  //   GitHub: 'github',
  //   CloudFlare: 'cloudflare',
  //   GoogleCloud: 'cloud'
  // }
  function scrollAbout () {
    about.scrollIntoView({ behavior: 'smooth' })
  }
  let hero

  const THREE = import('three')
  const net = import('vanta/src/vanta.net.js')
</script>
<script>
  let instance = null
  onMount(async () => {
    instance = (await net).default({
      el: hero,
      mouseControls: true,
      touchControls: true,
      gyroControls: true,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x7f47dd,
      backgroundColor: 0x0,
      THREE: await THREE
    })
  })
  onDestroy(() => {
    instance?.destroy()
  })
</script>
<section class='h-full d-flex flex-column justify-content-between hero' bind:this={hero}>
  <div />
  <div class='container content'>
    <div class='font-weight-bold hero-title text-white'>I'm Cas.</div>
    <div class='font-size-24 mb-20'>Software Developer. Web-Dev Enthusiast.</div>
    <button class='btn btn-lg btn-transparent border' type='button' on:click={() => { transition('showcase') }}>Showcase</button>
    <button class='btn btn-lg btn-primary ml-10' type='button' on:click={scrollContact}>Contact</button>
  </div>
  <!-- eslint-disable-next-line svelte/valid-compile -->
  <a on:click={scrollAbout} class='w-full d-flex justify-content-center py-20 pointer'><div class='about mb-20' /></a>
</section>
<section class='container font-size-16 mb-20' bind:this={about}>
  <div class='content'>
    <p>
      Hi, I'm <b>Cas</b>, but online I go as <b>ThaUnknown_</b>, as I don't reveal much information about myself and
      <b>take privacy <span class='font-size-12 font-weight-normal'>relatively</span> seriously.</b>
    </p>
    <p>
      I'm a <b>self-taught</b> developer based in Europe. I specialize in <b>frontend</b> development, handling and <b>streaming</b> large amounts of data, and any new shiny
      <b>experimental API</b>.
    </p>
    <p>I always put <b>simplicity and performance</b> first, to ensure my apps are snappy and lightweight.</p>
    <p class='pt-20'>
      <button class='btn btn-lg btn-transparent border' type='button' on:click={() => { transition('showcase') }}>Showcase</button>
      <button class='btn btn-primary btn-lg btn-transparent border ml-10' type='button' on:click={() => { transition('projects') }}>Projects</button>
    </p>
  </div>
</section>
<!-- <section class='container pt-20'>
  <h1 class='font-weight-bold'>Technologies I've used and am familiar with.</h1>
  <div class='font-size-16 justify-content-center d-flex flex-row flex-wrap'>
    {#each Object.entries(icons) as [key, value]}
      <img src='/public/logos/{value}.svg' alt={key} class='w-100 h-100 p-20' />
    {/each}
  </div>
</section> -->

<style>
  .btn {
    transition: transform 0.3s ease;
  }
  .btn:hover{
    transform: scale(1.1);
  }
  .hero {
    transform: translateZ(200px) scale(.5);
  }
  .hero-title {
    animation: text-pop-up-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) 3s both;
    font-size: 5rem;
  }
  .about {
    width: 1rem;
    height: 1rem;
    border-left: 3px solid #fff;
    border-bottom: 3px solid #fff;
    transform: rotate(-45deg);
    animation: more 1.5s infinite;
  }

  @keyframes more {
    0% {
      transform: rotate(-45deg) translate(0, 0);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: rotate(-45deg) translate(-20px, 20px);
      opacity: 0;
    }
  }

  @keyframes text-pop-up-top {
    0% {
      transform: translateY(0);
      transform-origin: 50% 50%;
      text-shadow: none;
    }
    100% {
      transform: translateY(-20px);
      transform-origin: 50% 50%;
      text-shadow: 0 1px 0 #bbb, 0 2px 0 #bbb, 0 3px 0 #bbb, 0 4px 0 #bbb, 0 5px 0 #bbb, 0 6px 0 #bbb, 0 7px 0 #bbb, 0 8px 0 #bbb, 0 9px 0 #bbb, 0 50px 30px rgba(0, 0, 0, 0.3);
    }
  }

</style>
