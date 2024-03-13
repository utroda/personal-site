<script setup>
  import { useRafFn, noop, } from '@vueuse/core'

  const canvasEl = ref(null);
  const func = {
    start: noop,
    stop: noop,
    refresh: noop,
  }

  onMounted(() => {
    const ctx = canvasEl.value.getContext('2d');

    const width = 400;
    const height = 400;

    const initCanvas = (width, height, _dpr = null) => {
      const dpr = window.devicePixelRatio || 1;
      const dpi = _dpr || dpr;

      canvasEl.value.width = width * dpi;
      canvasEl.value.height = height * dpi;
      canvasEl.value.style.width = `${width}px`;
      canvasEl.value.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    }

    const cx = width / 2;
    const cy = height / 2;

    const imgData = ctx.createImageData(width, height);

    const draw = (imgData, _x, _y) => {
      let x = _x % width;
      let y = _y % height;

      if (x < 0) {
        x += width;
      }

      if (y < 0) {
        y += height;
      }

      // 8-bit integer array representing the data in the RGBA order
      const pixelIndex = (y * width + x) * 4;

      // Sets a single pixel in the image data
      imgData.data[pixelIndex] = 255;
      imgData.data[pixelIndex + 1] = 255;
      imgData.data[pixelIndex + 2] = 255;
      imgData.data[pixelIndex + 3] = 255;
    }

    let lastX = 0;
    let lastY = 0;

    const genPixels = () => {
      const x = lastX + (Math.random() - 0.5) * 8;
      const y = lastY + (Math.random() - 0.5) * 8;

      const nx = Math.round(cx + x);
      const ny = Math.round(cy - y);

      draw(imgData, nx, ny);

      lastX = x;
      lastY = y;
    }

    const loop = () => {
      new Array(10).fill(0).forEach(genPixels);
      ctx.putImageData(imgData, 0, 0);
    }

    initCanvas(400, 400, 1);

    const controls = useRafFn(() => {
      loop();
    });

    func.start = controls.resume;
    func.stop = controls.pause;

    func.refresh = () => {
      for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = 0;
        imgData.data[i + 1] = 0;
        imgData.data[i + 2] = 0;
        imgData.data[i + 3] = 0;
      }

      ctx.putImageData(imgData, 0, 0);

      lastX = 0;
      lastY = 0;

      controls.resume();
    }
  });
</script>

<template>
  <canvas ref="canvasEl" class="canvas"></canvas>
  <div class="controls">
    <button @click="func.stop()">Stop</button>
    <button @click="func.refresh()">Refresh</button>
    <button @click="func.start()">Start</button>
  </div>
  <div class="help">
    You can use the buttons above to start/stop/refresh the random walk.
  </div>
</template>

<style scoped>
  .canvas {
    display: block;
    margin: 0 auto;
    border: 1px solid #000;
    background:#000;
  }

  .controls {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
  }

  .help {
    text-align: center;
    font-size: 0.875rem;
  }
</style>
