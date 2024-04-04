<script setup>
import { useResizeObserver, useDebounceFn } from '@vueuse/core'

const svgEl = ref(null);
const cols = ref(0);
const rows = ref(0);

const SPACING = 16;
const STYLES = ['normal', 'shaded', 'colored']

const resizeDebounced = useDebounceFn((entries) => {
  console.log(1);
  const entry = entries[0]
  const { width, height } = entry.contentRect

  rows.value = height / SPACING;
  cols.value = width / SPACING;
}, 500);

useResizeObserver(svgEl, resizeDebounced)
</script>

<template>
  <div class="drawing">
    <div class="fade" />
    <svg ref="svgEl" height="300" class="svg" aria-hidden="true">
      <g v-for="(col, index) in  Math.round(cols) " :key="index">
        <line v-for="(row, index2) in  Math.round(rows) " :key="index2" :x1="index * SPACING" :y1="index2 * SPACING"
          :x2="index * SPACING" :y2="index2 * SPACING" :stroke-width="Math.floor(Math.random() * (4 - 2 + 1)) + 2"
          :class="['basic', STYLES[Math.floor(Math.random() * STYLES.length)]]">
        </line>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.drawing {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  width: 100%;
  height: 50%;
  overflow: hidden;
}

.fade {
  position: absolute;
  inset: 0;

  background: linear-gradient(to bottom, #fafcff, rgba(255, 255, 255, 0))
}

.svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.basic {
  stroke: #ccc;
  stroke-linecap: round;
  transition: stroke .2s ease;
}

.shaded {
  stroke: #ddd;
}

.colored {
  stroke: #999;
}
</style>
