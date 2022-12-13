<script context='module'>
  async function load (repo) {
    const data = [
      fetch('https://api.github.com/repos/ThaUnknown/' + repo),
      fetch(`https://api.github.com/repos/ThaUnknown/${repo}/readme`),
      fetch(`https://api.github.com/repos/ThaUnknown/${repo}/stargazers?per_page=100`)
    ].map(req => req.then(res => res.json()))
    const [metadata, readme, stargazers] = await Promise.all(data)
    const markdown = await (await fetch(readme.download_url)).text()
    readme.markdown = markdown
    return { metadata, readme, stargazers }
  }

  function * chunks (arr, n) {
    for (let i = 0; i < arr.length; i += n) {
      yield arr.slice(i, i + n)
    }
  }
</script>

<script>
  import SvelteMarkdown from 'svelte-markdown'
  export let page
  const data = load(page)
  const options = { baseUrl: 'http://github.com/ThaUnknown/' + page }
</script>

<div class='container'>
  <div class='content'>
    {#await data}
      <h1 class='font-weight-bold'>Loading...</h1>
    {:then { metadata, readme, stargazers }}
      <div class='row'>
        <div class='col-lg-8 py-20 pr-lg-20'>
          <div class='p-20 bg-dark rounded shadow-lg zoom'>
            <a href={metadata.html_url} class='font-weight-bold font-size-24'>{page}</a>
            <div>{metadata.description ?? 'No description provided.'}</div>
          </div>
        </div>
        <div class='col-lg-4 py-20 pl-lg-20'>
          <div class='p-20 bg-dark rounded shadow-lg zoom'>
            <span class='pr-20 text-nowrap'>
              <svg viewBox='0 0 576 512'><path fill='#FFFFFF99' d='M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z' />
              {metadata.stargazers_count}
            </span>
            <span class='pr-20 text-nowrap'>
              <svg viewBox='0 0 384 512'><path fill='#FFFFFF99' d='M384 144c0-44.2-35.8-80-80-80s-80 35.8-80 80c0 36.4 24.3 67.1 57.5 76.8-.6 16.1-4.2 28.5-11 36.9-15.4 19.2-49.3 22.4-85.2 25.7-28.2 2.6-57.4 5.4-81.3 16.9v-144c32.5-10.2 56-40.5 56-76.3 0-44.2-35.8-80-80-80S0 35.8 0 80c0 35.8 23.5 66.1 56 76.3v199.3C23.5 365.9 0 396.2 0 432c0 44.2 35.8 80 80 80s80-35.8 80-80c0-34-21.2-63.1-51.2-74.6 3.1-5.2 7.8-9.8 14.9-13.4 16.2-8.2 40.4-10.4 66.1-12.8 42.2-3.9 90-8.4 118.2-43.4 14-17.4 21.1-39.8 21.6-67.9 31.6-10.8 54.4-40.7 54.4-75.9zM80 64c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16 7.2-16 16-16zm0 384c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm224-320c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16 7.2-16 16-16z' />
              {metadata.forks_count}
            </span>
            <span class='text-nowrap'>
              <svg viewBox='0 0 576 512'><path fill='#FFFFFF99' d='M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z' />
              {metadata.subscribers_count}
            </span>
            <div class='text-monospace'>
              {#each metadata.topics as topic}
                <div class='pr-20 pt-5 d-inline-block'>{topic}</div>
              {/each}
            </div>
          </div>
        </div>
      </div>
      {#if stargazers?.length}
        <h1 class='font-weight-bold'>Stargazers</h1>
        <div class='w-full stargazers overflow-hidden pb-20'>
          {#each [...chunks(stargazers, 20)] as stargazerRow}
            <div class='text-nowrap'>
              {#each stargazerRow as { html_url, avatar_url, login }}
                <a href={html_url} class='d-inline-flex p-10 text-reset zoom' target='_blank'>
                  <div class='bg-dark p-10 rounded font-weight-bold d-flex align-items-center'>
                    <img src={avatar_url} alt='avatar' class='rounded-circle mr-10' />
                    {login}
                  </div>
                </a>
              {/each}
            </div>
          {/each}
        </div>
      {/if}
      {#if readme?.markdown}
        <h1 class='font-weight-bold'>Project Readme</h1>
        <SvelteMarkdown source={readme.markdown} {options} />
      {/if}
    {/await}
  </div>
</div>

<style>
  img {
    width: 3rem;
    height: 3rem;
  }
  svg {
    height: 1.2rem;
    width: 1.2rem;
  }
  .stargazers > div:nth-child(odd) {
    animation: right 80s linear infinite alternate;
    float: left;
  }
  .stargazers > div:nth-child(even) {
    animation: left 80s linear infinite alternate;
    float: right;
  }

  @keyframes left {
    to {
      transform: translate(50%)
    }
  }

  @keyframes right {
    to {
      transform: translate(-50%)
    }
  }
  .zoom {
    transition: transform 0.3s ease;
  }
  .zoom:hover{
    transform: scale(1.1);
  }
</style>
