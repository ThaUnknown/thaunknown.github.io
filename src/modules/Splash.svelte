<script>
import { fly } from 'svelte/transition'
export let splash = ['Now with extra cookies!']
function getRand () {
  return splash[Math.floor(Math.random() * splash.length)]
}
let current = getRand()
setInterval(() => {
  current = getRand()
}, 2000)
</script>

{#key current}
  <div in:fly={{ y: 20, duration: 200 }} {...$$restProps}>
    {current}
  </div>
{/key}
