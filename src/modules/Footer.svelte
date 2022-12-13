<script context='module'>
  let contact = null
  export function scrollContact () {
    // this is a bad idea
    contact?.scrollIntoView({ behavior: 'smooth' })
  }
  const email = decodeURIComponent(atob('Y2FzaXN0YWtlbiU0MGdtYWlsLmNvbQ=='))
</script>
<div class='container py-20' bind:this={contact}>
  <hr />
  <div class='d-flex w-full justify-content-around pt-20'>
    <div>
      ThaUnknown_ © 2021 - {new Date().getFullYear()}
    </div>
    <div>
      <b>Email:</b>
      <a href='mailto:{email}'>{email}</a><br />
      <b>GitHub:</b> <a href='https://github.com/ThaUnknown/'>https://github.com/ThaUnknown</a>
    </div>
  </div>
</div>
