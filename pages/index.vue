<script setup>
import { formatDate } from '~/utils';
const query = { path: '/posts', sort: [{ publishDate: -1 }] };
</script>

<template>
  <div class="slide-enter-content">
    <ContentDoc class="bio" path="_bio" />
    <div class="divider"></div>
    <h2>Posts</h2>
    <ContentList :query="query" v-slot="{ list }">
      <ul class="posts">
        <li v-for="post in list" :key="post._path">
          <div class="date">{{ formatDate(post.publishDate) }}</div>
          <h2>
          <NuxtLink :to="`posts/${post._path.split('/').pop()}`">
            {{ post.title }}
          </NuxtLink>
          </h2>
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
  border: 0;
  height: 1px;
  background: #ddd;
  margin: 1.5rem 0;
}

.posts {
  margin-top: 2rem;
}

.posts li {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #ddd;
  padding: 1rem 0;
}

.posts h2 {
  font-size: 1.25rem;
  text-align: left;
  margin: 0;
}

.posts li:first-child {
  padding-top: 0;
}

.date {
  font-size: 0.75rem;
}
</style>
