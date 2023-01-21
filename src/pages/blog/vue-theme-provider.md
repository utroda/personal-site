---
layout: "../../layouts/BlogPost.astro"
title: "Building a theme provider in Vue 3"
description: "When building complex apps that need to support multiple themes or dark mode, using a theme provider can help maintain those styles on a global level."
pubDate: "Jan 21 2023"
---

In Vue 3, the concept of a theme provider component allows developers to easily manage and apply a
consistent theme across their application. This can include things like colors, typography, and other
design delements. In this blog post, I will explore how to use a theme provider component in Vue 3 
and the benefits it can provide.

### Creating a Theme Provider Component

For this example we will be creating a theme provider to support light and dark modes.  Typically 
most theme providers will allow you to pass an object, and declar all of the design elements you want to use.
However, with the ability to define variables within CSS natively, I perfer to define theme values as
"tokens" where the values update depending on the root class applied. Lets being by defining our values
in CSS.

```css
# ./themes.css

.theme-light  {
  --color-bg-primary:#f2f2f2;
  --color-text-primary:#222222;
  --font-size-sm:0.825rem;
  --font-size-lg:1.5rem;
  # more tokens ...
}

.theme-dark  {
  --color-bg-primary:#2d2d2d;
  --color-text-primary:#f1f1f1;
  --font-size-sm:0.825rem;
  --font-size-lg:1.5rem;
  # more tokens ...
}
```

Leverage your `themes.css` file in your global styles or by defining these values on a per component basis.

```css
# global.css

body {
  background: var(--color-bg-primary);
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}
```
Once you have defined your theme styles, you can now create a new Vue component that acts as the 
theme provider. This component should be the highest-level component in your application. We will
be using Vue 3 and the composition API to create the theme provider.

```vue
// ThemeProvider.vue
<script setup lang="ts">
import { ref, computed } from 'vue';

  type Theme = 'light' | 'dark ';

  const currentTheme = ref<Theme>('light');
  const updateTheme = (newTheme: Theme) => currentTheme.value = newTheme;
  const themeClass = computed(() => `theme-${currentTheme.value}`);
</script>

<template>
  <div :class="themeClass">
    <slot :updateTheme="updateTheme" />
  </div>
</template>
```
We have done a couple of things now:
1) We've defined the acceptable theme values by setting the theme Type, along with using a computed property
to take our theme and build our formatted class name.
2) We are using scoped slots to pass the `updateTheme` method.

### Using your theme provider
Now that we have created our theme provider component, we can now use it in our application by wrapping it around your root Vue component. This will ensure that the theme specific styles will be applied across our application.

```vue
// App.vue
<script setup>
import ThemeProvider from './components/ThemeProvider.vue';
</script>

<template>
  <ThemeProvider v-slot="{ updateTheme }" :class="app">
    <div>Hello World</div>
  </ThemeProvider>
</template>
```

If we run our application, and inspect the source, you should see the following rendered markup:

```html
<!-- Render Output -->
<div class="theme-light app">
  <div>Hello World</div>
</div>
```

Lets add some buttons to switch between the theme styles.

```vue
// App.vue
<script setup>
import ThemeProvider from './components/ThemeProvider.vue';
</script>

<template>
  <ThemeProvider v-slot="{ updateTheme }" :class="app">
    <div>Hello World</div>
    <button @click="updateTheme('dark')">Apply Dark Theme</button>
    <button @click="updateTheme('light')">Apply Light Theme</button>
  </ThemeProvider>
</template>
```
Awesome we can now switch our theme classes on the root node of our application. 

Using a theme provider component in Vue 3 can provide a number of benefits. One of the main benefits
is that it allows you to easily manage and apply a consistent theme throughout your application. This
can improve the overall design and user experience.

Another benefit is that it can make it easier to make changes to your theme. For example, if you
want to change the color scheme of your application, you can simply update the "tokens" in your `themes.css`
style sheet and the changes will be automatically reflectd throughout your application.

Finally, we now have a single source of truth which means it going to be easier to maintain our code, because
all of the design elements are centralized.
