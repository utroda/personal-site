<template>
  <div class="layout">
    <nav class="nav">
      <NuxtLink to="/" title="Home" aria-label="Back To Home">outwest</NuxtLink>
      <span class="nav__spacer">/</span>
      <NuxtLink to="https://www.linkedin.com/in/jared-west-b95264a4/" title="Linkedin"
        aria-label="View My Linkedin Profile">Linkedin</NuxtLink>
      <span class="nav__spacer">/</span>
      <NuxtLink to="https://github.com/utroda">Github</NuxtLink>
      <span class="nav__spacer">/</span>
      <NuxtLink to="https://dribbble.com/utroda">Dribbble</NuxtLink>
    </nav>
    <slot />
  </div>
</template>

<style scoped>
.layout {
  padding: 0 1.5rem;
  position: relative;
  z-index: 2;
  background-color: #fafcff;
  min-height: 100vh;
}

.nav {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
  font-size: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ddd;
}
</style>
