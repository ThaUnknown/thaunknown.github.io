<script>
let transition = false
let hide = false

setTimeout(() => {
  hide = true
  transition = true
}, 5000)
</script>

<div class='w-full h-full con font-weight-bold z-100 overflow-hidden' class:hide>
  <div class='h-full text d-flex align-items-center justify-content-center anim' class:transition>
    Epilepsy Warning
  </div>
</div>

<style>
  @keyframes background{
    from {background-position: top right;}
    to {background-position: top left;}
  }
  @keyframes un-background{
    from {background-position: top left;}
    to {background-position: top right;}
  }
  .con {
    transition: 1s ease
  }
  .text {
    width: 100vw;
    text-align: center;
    white-space: nowrap;
    font-size: 10rem;
    color: transparent;
    background:
      linear-gradient( 90deg, #000  50%, #fff 0),
      linear-gradient( 90deg, #fff 50%, #000 0);
    background-repeat: no-repeat;
    background-size: 200% 100%;
    background-position: top right;
    -webkit-background-clip: text, padding-box;
    background-clip: text, padding-box;
    animation: .8s background ease forwards;
  }
  .text.transition {
    animation: .8s un-background ease forwards;
  }
  .hide {
    width: 0 !important;
  }
</style>
