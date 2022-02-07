<script>
  let x = 0;
  let y = 0;
  function perspective({ clientX, clientY }) {
    window.requestAnimationFrame(() => {
      let box = card.getBoundingClientRect();
      x = -(clientY - box.y - box.height / 2) / 2000;
      y = (clientX - box.x - box.width / 2) / 2000;
    });
  }
  let card = null;

  window.addEventListener('deviceorientation', handleOrientation, true);
  function handleOrientation({ beta, gamma }) {
    x = -beta / 100;
    y = -gamma / 100;
  }
</script>

<div class="bg" />
<div class="w-full h-full d-flex justify-content-center align-items-center" on:mousemove={perspective}>
  <div class="welcome shadow-lg w-three-quarter h-three-quarter p-20" bind:this={card} style="transform: perspective(100px) rotateX({x}deg) rotateY({y}deg)">
    <p>Hi, I'm</p>
    <h1>Cas</h1>
    <p>I bend browsers to my will.</p>
  </div>
</div>

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
