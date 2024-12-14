---
title: "Improve TBT with requestIdleCallback"
description: "Using requestIdleCallback to improve total blocking time with 3rd party javascript"
publishDate: 2024-12-30
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

We'll build a helper component, using a render function to add scripts to our
site, leverage `requestIdleCallback`.

```js
<script setup>
    import { h } from 'vue';

    const loadScript = () => {
        const ignored = ['onLoad', 'onError'];
        const { src, onLoad, onError } = props;
        const el = document.createElement('script');

        const loadPromise = new Promise((resolve, reject) => {
            el.addEventListener('load', function() {
                resolve();
                // Call our onLoad if its defined
                if (props.onLoad) props.onLoad.call(this);
            });
            el.addEventListener('error', function() {
                reject();
                if (props.onError) props.onError.call(this);
            })
        };

        el.src = src;

        for(const [key, value] of Object.entries(props)) {
          // Skip Attributes 
          if (ignored.includes(key)) {
            continue;
          }
          const attr = key.toLowerCase();
          el.setAttribute(attr, value);
        }

        document.body.appendChild(el);
    }

    const lazyWithFallback = () => {
        if (document.readyState === 'complete') {
          requestIdleCallback(() => loadScript(props));
        } else {
        }
    };
</script>
```

## Conculsion 


