import App from './App.svelte'

function overwrite (node) {
  node.children[0].remove()
  return node
}

const app = new App({
  target: overwrite(document.body)
})

export default app
