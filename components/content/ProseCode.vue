<template>
  <div class="code-container">
    <div v-if="filename" class="filename">
      {{ filename }}
    </div>
   <slot />
  </div>
</template>

<script setup>
  const props = defineProps({
    code: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: null
    },
    filename: {
      type: String,
      default: null
    },
    highlights: {
      type: Array,
      default: () => []
    },
    meta: {
      type: String,
      default: null
      }
  })
</script>

<style scoped>
.code-container {
  display: flex;
  flex-direction: column;
  border: 1px solid #a4a6b1;
  border-radius: 4px;
  overflow: hidden;
}

.filename {
  padding: 0.5rem;
  font-weight: 600;
  background-color: #ddd;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #3f3f3f;
}

:slotted(pre) {
  margin-top: 0;
  margin-bottom: 0;
  display: flex;
  flex: 1 1 0%;
  overflow-x: auto;
  padding: 1rem;
  line-height: 1.625;
  counter-reset: lines;
}

:slotted(pre code) {
  width: 100%;
  display: flex;
  flex-direction: column;
}

:slotted(pre code .line) {
  display: inline-table;
  min-height: 1rem;
}

:slotted(pre code .line::before) {
  counter-increment: lines;
  content: counter(lines);
  width: 1rem;
  margin-right: 1.5rem;
  display: inline-block;
  text-align: left;
  color: rgba(115, 138, 148, 0.4);
}

:slotted(pre code .highlight) {
  background-color: #c9deca;
  display: block;
  margin-right: -1em;
  margin-left: -1em;
  padding-right: 1em;
  padding-left: 0.75em;
  border-left: 0.25em solid green;
}
</style>
