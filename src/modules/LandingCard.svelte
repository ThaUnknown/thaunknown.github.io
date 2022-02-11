<script>
  import LookAt from './LookAt.svelte'
  import Splash from './Splash.svelte'
  const splash = [
    'I bend browsers to my will',
    'I write high-performance JS',
    'I know P2P',
    'I work with data streaming',
    'I work with big data',
    'I can use bitwise operators',
    'I write regex from memory',
    'I create the impossible',
    'I envy knowledge',
    'I never stop learning',
    'I can optimise JS',
    "I support experimental API's",
    'I create cutting edge webapps',
    'I utilise hardware acceleration',
    'I know what the user wants',
    'I prefer simplicity'
  ]
</script>

<div class="bg" />
<LookAt class="w-full h-full d-flex justify-content-center align-items-center">
  <div class="welcome shadow-lg w-three-quarter h-three-quarter p-20">
    <div class="p-20 m-20">
      <h4 class="px-20 my-0 font-weight-bold">Hi, I'm</h4>
      <h1 class="px-20 my-0 font-weight-bold">Cas</h1>
      <Splash {splash} class="p-20 font-weight-bold font-size-24" />
    </div>
  </div>
</LookAt>

<style>
  .welcome {
    background: linear-gradient(-45deg, #e73c7e, #ee7752, #e73c7e);
    background-size: 600% 600%;
    animation: gradient 30s ease infinite;
  }
  @keyframes gradient {
    0% {
      background-position: 0% 0%;
    }
    50% {
      background-position: 100% 100%;
    }
    100% {
      background-position: 0% 0%;
    }
  }
  h1 {
    font-size: 8rem !important
  }
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    transform: translateZ(-3px) scale(4);
    height: 100%;
    width: 100%;
    background: url('/public/tile.png');
    background-position: center center;
  }
</style>
