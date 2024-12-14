<script setup>
// TODO: convert to use h()
  const loadScript = (props) => {
    const el = document.createElement('script');
    const ignored = ['onLoad'];
    const { src } = props;

    const loadPromise = new Promise((resolve, reject) => {
      el.addEventListener('load', function() {
        resolve();
        if (props.onLoad) props.onLoad.call(this);
      });

      el.addEventListener('error', reject);
    });

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
  };


  const lazyLoadScript = (props) => {
    if (document.readyState === 'complete') {
      requestIdleCallback(() => loadScript(props));
    }
    // Add fallback window load
  }

</script>

<template>
  h
</template>
