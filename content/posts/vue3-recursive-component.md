---
title: "Fundamentals: Vue 3 Recursive Component"
description: "Render a binary tree with recursion using a vue 3 component."
publishDate: 2024-04-8
tags: ["Vue", "Recursion", "Experiment", "Fundamentals"]
---

Recently, I've been developing a window manager component using Vue 3. 
I began this project by creating a proof of concept (POC) using a standard
component approach, relying on props and for loops.

Once the POC reached a certain stage, and I had a clear grasp
of the basic cases and resizing logic, I shifted my focus to managing windows
and nesting. Initially, the POC only facilitated window arrangement along the
x-axis. However, for long-term viability, we required support for both x and y axes,
along with the ability to handle deeply nested windows.

This seems to be an ideal scenario for utilizing a binary tree. Each node in the
tree can accommodate a left and right branch, allowing for recursive traversal down the tree.

So, the question arises: how can we achieve this using Vue single file components?

Thankfully, Vue already supports this. You can find more information in the 
[documentation](https://vuejs.org/api/sfc-script-setup.html#recursive-components).
All we need to do is reference the component's filename within the component.

## Building It Out

Let's define a basic binary tree that we will pass to our component as a prop called 
`node`. If you're unfamiliar with this data structure, you can find more information on its [wiki](https://en.wikipedia.org/wiki/Binary_tree).

```vue
<script setup>
import TheTree from './components/TheTree.vue'
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
};
</script>
<template>
<ul>
    <TheTree :node="node" />
</ul>
</template>
```
Now let's setup `TheTree` component.

```vue
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
```

This should all look pretty straightforward, and as you can see, the component is calling itself using the filename `TheTree`.

For demonstration purposes, I've added the CSS variable `opacity` so we can visually see the nested nodes.

## Demo

---

:DemoRecursive

---

## Conclusion

Building a recursive component in Vue is surprisingly straightforward. By leveraging Vue's support for recursive components and utilizing the power of props and single file components, we were able to create a flexible and scalable tree component. 

With the basic structure in place, you can further customize and expand upon it to suit your specific requirements. Whether it's adding additional functionality or enhancing the visual presentation, the possibilities are endless.

To learn more about Vue's capabilities with recursive components, check out the [Vue 3 documentation](https://vuejs.org/api/sfc-script-setup.html#recursive-components). For a deeper understanding of binary trees, you can explore the concept further on its [Wikipedia page](https://en.wikipedia.org/wiki/Binary_tree).

