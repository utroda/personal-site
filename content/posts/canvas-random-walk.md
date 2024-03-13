---
title: "Experiment: Canvas Random Walk"
description: ""
publishDate: 2024-03-04
draft: true
tags: ["Vue", "RAF", "Canvas", "Experiment"]
---

Lately, I've been on a bit of a late-night creative spree, tinkering with some fun experiments. These past few nights, I've been absorbed in crafting a nifty little random walk demo using Canvas and its handy 2D API.

The aim was to craft an random walk on canvas. I initially built out the concept using `p5.js`, which helped me build POC quickly after about an hour. After that, I transitioned it to native Canvas.

---

:DemoRndWalk

---

What we are doing here is creating a blank [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createImageData) object the same size as our canvas. The nice part here is all of the pixels in the new object are transparent.

Next we are leveraging `raf` and running our "loop" for each frame. You'll notice within the `loop()` method the following code:

```js
new Array(10).fill(0).forEach(genPixels);
ctx.putImageData(imgData, 0, 0);
```

This iterator enables us to draw 10 pixels simultaneously. Optionally, we could convert this into a ref to make it dynamic, allowing for variable pixel counts per frame. This is a nice touch imo because it allows to control the rendering speed independent of the default fps.

It's important to remember that when dealing with the canvas and an `ImageData` object, the data property holds a `Uint8ClampedArray`. This means we must handle the data property as an array that follows the RGBA order, with values ranging from `0` to `255`.

If you look at the source you'll notice the following bit of code for finding the pixel index:

```js
const pixelIndex = (y * width + x) * 4;
```

It took me minute to wrap my head around this but, in order to find the specific index we have to convert 2d coordinates to a 1D array. We do this by multiplying `y` by the `width` which gives us the starting index of the row. Then we add `x` to the starting index to find the exact position of the pixel within that row. We then multiply by `4` because each pixel consists of four values (RGBA).

## Conclusion

This project took me far from my usual tasks, but it was a fun adventure that pushed me beyond my comfort zone for a couple of nights.

- [Nuxt Demo Component Source](https://github.com/utroda/personal-site/tree/main/components/content)
- [Standlone Component Source](https://github.com/utroda/vue3-random-walk)
- [p5 Insperation Demo](https://happycoding.io/tutorials/p5js/animation/random-walker)
