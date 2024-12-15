---
title: "Improve TBT with requestIdleCallback"
description: "Using requestIdleCallback to improve total blocking time with 3rd party javascript"
publishDate: 2024-12-15
tags: ["Vue", "3rd Party Javascript", "Experiment", "Components"]
---

As web developers, we're constantly striving to optimize our website's performance
to provide a seamless user experience. One crucial aspect of this is managing the
loading of third-party JavaScript files, which can significantly impact our
website's Total Blocking Time (TBT). In this blog post, we'll explore how leveraging
`requestIdleCallback` can help us load 3rd party JavaScript files more efficiently
and improve our TBT scores.

## What is requestIdleCallback?

`requestIdleCallback` is a JavaScript API that enables developers to schedule tasks
to be executed when the browser's event loop is idle [[5](https://developer.chrome.com/blog/using-requestidlecallback)]. 
This API is particularly useful for non-essential tasks that don't require immediate
attention, such as loading third-party JavaScript files. 

The down side here is that the browser support is _still_ pretty low at the time of
writing this. [CanIUse](https://caniuse.com/requestidlecallback) is reporting only **77%** coverage.
However, there's a shim and polyfill available:

- [Shim](https://gist.github.com/paullewis/55efe5d6f05434a96c36)
- [Polyfill](https://github.com/behnammodi/polyfill/blob/master/window.polyfill.js)

## Why Use requestIdleCallback for Loading 3rd Party JavaScript?

Loading third-party JavaScript files can be a significant contributor to TBT, 
as it blocks the main thread and prevents the browser from responding to user interactions.
By using `requestIdleCallback`, we can defer the loading of these files to idle periods,
reducing the impact on our website's responsiveness.

## defer vs requestIdleCallback

`defer` is an attribute that can be added to script tags to indicate that the
script should be executed after the document has finished parsing. This means 
that the script will be downloaded in parallel with the HTML parsing, but its
execution will be delayed until the HTML parsing is complete. This approach is 
useful for scripts that don't need to be executed immediately, but still need to
be executed before the page is fully loaded.

On the other hand, `requestIdleCallback` is a function that schedules a 
callback to be executed during the browser's idle periods. This means that the
callback will be executed when the browser is not busy with other tasks, such as
rendering, parsing, or responding to user input. This approach is useful for tasks
that don't have a specific deadline and can be executed at any time, such as loading
non-essential resources or performing background tasks.

## Lets build a Vue Componenet To Help

To start, lets build a single file component, to load our 3rd party javascript,
by using the `requestIdleCallback`.

```vue
<script>
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'ScriptLoader',
  props: {
    src: {
      type: String,
      required: true,
    }
  },
  setup(props) {

    const loadScript = () => {
      const el = document.createElement('script');
      const ignoredAttributes = ['onLoad'];
      const { src } = props;

      el.src = src;

      // Map attrbutes to element, skip our ignore list
      for (const [key, value] of Object.entries(props)) {
        if (ignoredAttributes.includes(key)) {
          continue;
        }
        const attr = key.toLowerCase();
        el.setAttribute(attr, value);
      };

      document.body.appendChild(el);
    }

    const lazyLoadScript = () => {
      if (document.readyState === 'complete') {
        requestIdleCallback(() => loadScript());
      } else {

        const handler = () => {
          requestIdleCallback(() => loadScript());
          window.removeEventListener('load', handler);
        }

        window.addEventListener('load', handler);
      }
    }

    onMounted(() => {
      lazyLoadScript();
    });
  }
});
</script>
```
This utility component `useScript` can now be used to load 3rd party scripts.

- It will take `src` prop that specifies which script to load
- Implements lazy loading optimizations:
  - If the page is already loaded (`readyState === 'complete'`), it uses
  request `requestIdleCallback` to load the script when the browser is idle.
  - If the page is still loading, it waits for the `load` event before loading the script
  - Cleans up the event listerns to prevent memory leaks
- This component is "renderless" and doesn't output any visible HTML. 

## Demo

The demo below simulates how different script loading strategies behave during page load. It simulates loading scripts from various CDNs while adding controlled delays to clearly illustrate the timing differences. Watch as regular scripts block execution (red), async scripts load independently (green), defer scripts wait for parsing (blue), and component-loaded scripts wait for browser idle time (orange). 

:DemoScriptLoader

---

## Improvements

Let's improve this a bit, and add a caching layer that will store a promise and call the `onLoad` event in the case we have multiple components requesting the same script.

```vue ins={4,21-43}
<script>
import { defineComponent, onMounted } from 'vue';

const CacheMap = new Map();

export default defineComponent({
  name: 'ScriptLoader',
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  setup(props) {

    const loadScript = () => {
      const el = document.createElement('script');
      const ignoredAttributes = ['onLoad'];
      const { src, onLoad } = props;

      if (CacheMap.has(src)) {
        CacheMap.get(src)
          .then(onLoad)
          .catch(() => {
            // If cached script failed, remove from cache and retry
            CacheMap.delete(src);
            loadScript();
          });
        return
      }

      const handleCacheLoad = new Promise((resolve, reject) => {
        el.addEventListener('load', function(e) {
          resolve();
          if (onLoad) onLoad.call(this, e);
        });
        el.addEventListener('error', function(e) {
          reject(e);
        });
      });

      el.src = src;
      CacheMap.set(src, handleCacheLoad);

      // Map attrbutes to element, skip our ignore list
      for (const [key, value] of Object.entries(props)) {
        if (ignoredAttributes.includes(key)) {
          continue;
        }
        const attr = key.toLowerCase();
        el.setAttribute(attr, value);
      };

      document.body.appendChild(el);
    }

    const lazyLoadScript = () => {
      if (document.readyState === 'complete') {
        requestIdleCallback(() => loadScript());
      } else {

        const handler = () => {
          requestIdleCallback(() => loadScript());
          window.removeEventListener('load', handler);
        }

        window.addEventListener('load', handler);
      }
    }

    onMounted(() => {
      lazyLoadScript();
    });
  }
});
</script>
```

The `CacheMap` is a global cache that stores Promises representing the loading state of external scripts. When a script is first requested, it creates a new Promise that resolves when the script loads successfully, stores this Promise in the `CacheMap` using the script's URL as the key, and then appends the script to the document. When the same script URL is requested again by another component, instead of creating and loading a duplicate script tag, it retrieves the cached Promise from the `CacheMap` and waits for it to resolve, ensuring that each external script is only loaded once no matter how many components request it.

## Conculsion 

By implementing this script loader component, we gain better control over how and when external scripts load in our Vue applications. This leads to improved performance, better user experience, and cleaner code organization.
The component's simple yet powerful approach to script loading demonstrates how we can build reusable solutions for common web development challenges while maintaining performance best practices.

Remember, performance optimization is an ongoing process, and this component is just one tool in our optimization toolkit. Always measure and monitor your application's performance to ensure your optimizations are having the desired impact.
