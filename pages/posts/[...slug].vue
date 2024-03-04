<script setup>
  const handleStt = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  onMounted(() => {
    const stt = document.querySelector('.stt');

    window.addEventListener("scroll", function() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        stt.style.display = "block";
      } else {
        stt.style.display = "none";
      }
    });
  });
</script>

<template>
   <ContentDoc v-slot="{ doc }">
      <article class="post">
        <header class="header">
          <h1>{{ doc.title }}</h1>
          <p>{{ doc.publishDate }}</p>
          <div class="divider"></div>
        </header>
        <ContentRenderer :value="doc" />
        <div class="divider"></div>
        <NuxtLink to="/">Back to home</NuxtLink>
      </article>
   </ContentDoc>
   <button 
    @click.prevent="handleStt"
    ref="stt"
    class="stt">
    Back To Top
  </button>
</template>

<style scoped>
  :deep(ul) {
    list-style: square;
    margin-left: 2rem;
    font-size: 0.875rem;
  } 

  .header {
    display: flex;
    flex-direction: column;
  }

  .header h1 {
    font-size: 2rem;
    line-height: 1.2;
    margin-bottom:0;
  }

  .header p {
    font-size: 0.875rem;
  }

  .post {
    padding-bottom: 4rem;
  }

  .stt {
    display: none;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    background-color: #000;
    color: #fff;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
