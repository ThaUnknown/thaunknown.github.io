<script context='module'>
  export let transition = () => {}
</script>
<script>
  let animate = false
  let root = null
  export let page = 'home'
  transition = target => {
    animate = false
    // eslint-disable-next-line no-unused-vars
    const noop = root.offsetHeight // force trigger DOM reflow to restart animation
    animate = target
    setTimeout(() => {
      page = target // transition in the middle of animation
    }, 1000)
  }
</script>
<div class='h-full con font-weight-bold overflow-hidden position-absolute' class:animate bind:this={root}>
  <div class='h-full text d-flex align-items-center justify-content-center text-nowrap text-capitalize'>
    {animate}
  </div>
</div>

<style>
  @keyframes transition {
    0% {
      background-position: top right;
      width: 0;
    }
    30% {
      width: 100vw;
    }
    35% {
      background-position: top left;
    }
    65% {
      background-position: top left;
      width: 100vw;
    }
    95% {
      background-position: top right
    }
    100% {
      width: 0 !important;
    }
  }
  .con {
    z-index: 90;
    width: 0;
  }
  .animate {
    animation: 2s transition ease forwards;
  }
  .text {
    font-size: 10rem;
    color: transparent;
    width: 100vw;
    background: linear-gradient(90deg, #fff 50%, #000 0), linear-gradient(90deg, #000 50%, #fff 0);
    background-repeat: no-repeat;
    background-size: 200% 100%;
    background-position: inherit;
    -webkit-background-clip: text, padding-box;
    background-clip: text, padding-box;
  }
</style>
