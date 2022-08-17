<script>
import { onMount } from 'svelte'

let hide = false
let svg = false

function hideLoader () {
  setTimeout(() => {
    svg = false
    hide = true
  }, 2000)
}
onMount(() => {
  setTimeout(() => {
    svg = true
  }, 1000)
})
</script>

<svelte:window on:DOMContentLoaded={hideLoader} />

<div class='w-full h-full con font-weight-bold z-100 overflow-hidden' class:hide>
  <div class='h-full text d-flex align-items-center justify-content-center text-nowrap' class:transition={hide}>
    <div class={svg ? 'd-none' : 'd-flex'}>Epilepsy Warning</div>
    <svg class='w-full h-full {svg ? 'd-flex' : 'd-none'}'>
      <text x='50%' y='50%' dy='4.15rem' text-anchor='middle' font-size='10rem' font-weight='700' stroke-width='1px'>
        Epilepsy Warning
      </text>
    </svg>
  </div>
</div>

<style>
  @keyframes background {
    from { background-position: top right }
    to { background-position: top left }
  }
  @keyframes un-background {
    from { background-position: top left }
    to { background-position: top right }
  }
  @keyframes stroke {
    0%   {
      stroke: #fff;
      fill: #000;
    }
    20%   {
      fill: #000;
      background: #000;
    }
    21%  {
      background: #fff;
      fill: #000;
    }
    40%  {
      fill: #000;
      stroke: #fff;
    }
    41%  {
      fill: #fff;
      stroke: #000;
    }
    60%  {
      background: #fff;
      fill: #fff;
      stroke: #000;
    }
    61%  {
      background: none;
      fill: #000;
      stroke: #fff;
    }
    80%  {
      fill: #000;
      stroke: #fff;
    }
    81%  {
      fill: #fff;
      stroke: #000;
    }
    100% {
      background: none;
      fill: #fff;
      stroke: #000;
    }
  }
  svg {
    animation: stroke .8s forwards;
    fill: #000;
    stroke: #fff;
  }
  .con {
    transition: width 1s ease;
  }
  svg {
    font-size: 10rem;
  }
  .text {
    font-size: 10rem;
    color: transparent;
    width: 100vw;
    background: linear-gradient(90deg, #fff 50%, #000 0), linear-gradient(90deg, #000 50%, #fff 0);
    background-repeat: no-repeat;
    background-size: 200% 100%;
    background-position: top right;
    -webkit-background-clip: text, padding-box;
    background-clip: text, padding-box;
    animation: .8s background ease forwards;
  }
  .transition {
    animation: .8s un-background ease forwards;
  }
  .hide {
    width: 0 !important;
  }
</style>
