<script setup>
import { useResizeObserver, useDebounceFn } from '@vueuse/core'

const svgEl = ref(null);
const cols = ref(0);
const rows = ref(0);
const key = ref(0); // Add a key for forcing re-render

const SPACING = 12;
const MAX_STROKE_WIDTH = 2;
const MIN_STROKE_WIDTH = 2;
const STYLES = ['normal', 'shaded', 'colored'];

// Calculate padding needed based on maximum stroke width
const PADDING = MAX_STROKE_WIDTH / 2;

const resizeDebounced = useDebounceFn((entries) => {
  const entry = entries[0]
  const { width, height } = entry.contentRect

  // Adjust available space by padding
  const availableWidth = width - (2 * PADDING);
  const availableHeight = height - (2 * PADDING);

  rows.value = availableHeight / SPACING;
  cols.value = availableWidth / SPACING;
}, 500);

const handleRefresh = () => {
  key.value++; // Increment key to force re-render
};

useResizeObserver(svgEl, resizeDebounced)
</script>

<template>
  <div class="drawing">
    <svg ref="svgEl" height="100" class="svg" aria-hidden="true">
      <!-- Add a viewBox to control the drawing area -->
      <g transform="translate(2, 2)"> <!-- Translate by PADDING amount -->
        <g v-for="(col, index) in Math.round(cols)" :key="`${index}-${key}`">
          <circle v-for="(row, index2) in Math.round(rows)" :key="`${index2}-${key}`" :cx="index * SPACING"
            :cy="index2 * SPACING"
            :r="Math.floor(Math.random() * (MAX_STROKE_WIDTH - MIN_STROKE_WIDTH + 1)) + MIN_STROKE_WIDTH"
            :class="['basic', STYLES[Math.floor(Math.random() * STYLES.length)]]" />
        </g>
      </g>
    </svg>
    <button class="refreshBtn" @click="handleRefresh">
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        width="18" height="18" viewBox="0 0 30 30">
        <path
          d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z">
        </path>
      </svg></button>
  </div>
</template>

<style scoped>
.drawing {
  width: 100%;
  height: 100px;
  overflow: hidden;
  position: relative;
}

.svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.basic {
  fill: #ccc;
  transition: fill .2s ease;
}

.shaded {
  fill: #d0ebff;
}

.colored {
  fill: #339af0;
}

.refreshBtn {
  background: unset;
  border: unset;

  position: absolute;
  bottom: 1rem;
  right: 1rem;

  background: #f1f3f5;
  border: 1px solid #868e96;
  border-radius: 4px;
  cursor: pointer;
}
</style>
