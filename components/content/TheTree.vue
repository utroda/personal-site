<script setup>
defineProps({
  node: Object,
})
</script>

<template>
  <li :style="`--opactiy: ${node.value * 0.10};`">
    {{ node.value }}
    <ul v-if="node.left">
      <TheTree :node="node.left" />
    </ul>
    <ul v-if="node.right">
      <TheTree :node="node.right" />
    </ul>
  </li>
</template>

<style scoped>
li {
  background: rgba(255, 0, 0, var(--opacity, 0.1));
}
</style>
