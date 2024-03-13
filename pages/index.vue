<script setup>
  const query = { path: '/posts', sort: [{ updatedAt: 1 }] };
</script>

<template>
  <div class="slide-enter-content">
    <ContentDoc class="bio" path="_bio" />
    <div class="divider"></div>
    <h2>Posts</h2>
    <ContentList 
      :query="query"
      v-slot="{ list }">
      <ul class="posts">
        <li v-for="post in list" :key="post._path">
          <span class="date">{{ post.publishDate }}</span>
          <NuxtLink :to="`posts/${post._path.split('/').pop()}`">
            {{ post.title }}
          </NuxtLink>
        </li>
      </ul>
    </ContentList>
  </div>
</template>

<style>
  .bio h1 {
    font-size: 2rem;
    line-height: 1.2;
  }

  .divider {
    border:0;
    height: 1px;
    background: #ddd;
    margin: 1.5rem 0;
  }

  .posts {
    margin-top: 2rem;
  }

  .posts li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    padding: 1.5rem 0;
  }

  .posts li:first-child {
    padding-top:0;
  }

  .date {
    font-size: 0.75rem;
  }
</style>
