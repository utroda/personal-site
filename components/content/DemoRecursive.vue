<script setup>
import TheTree from './TheTree.vue'

const tree = {
  value: 1,
  left: {
    value: 2,
    left: {
      value: 4,
      left: null,
      right: null,
    },
    right: {
      value: 5,
      left: null,
      right: null,
    },
  },
  right: {
    value: 3,
    left: null,
    right: null,
  },
}
</script>

<template>
  <TheTree :node="tree" />
</template>
