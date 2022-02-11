<script>
  let x = 0;
  let y = 0;
  let style = '';
  let container = null;
  function perspective({ clientX, clientY }) {
    let box = container.getBoundingClientRect();
    x = -(clientY - box.y - box.height / 2) / 2000;
    y = (clientX - box.x - box.width / 2) / 2000;
  }

  window.addEventListener('deviceorientation', handleOrientation, true);
  function handleOrientation({ beta, alpha }) {
    x = (-beta - 80) / 40;
    y = -alpha / 40;
  }

  $: window.requestAnimationFrame(() => (style = `--transform: perspective(100px) rotateX(${x}deg) rotateY(${y}deg)`));
</script>

<div {...$$restProps} on:mousemove={perspective} bind:this={container} {style}>
  <slot />
</div>

<style>
  div > :global(*) {
    transform: var(--transform);
  }
</style>
