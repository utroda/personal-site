---
layout: "../../layouts/BlogPost.astro"
title: "Building a better button component"
description: "Part 1: Lets decouple style from a components semantic meaning, and build a more dynamic button component."
pubDate: "Jan 22 2023"
---

Working on different design systems over the years, I've noticed a pattern from teams standing up a component framework from scratch. I believe this has a lot to do when developers try and sync components to the provided mocks from the UX team. This typically sounds like a great idea at first, but can lead to multiple abstractions quickly and can become painful to iterate on later.

### A look at the problem

The following is an all to common pattern. Does this look familiar? We have a button base component that gets abstracted into multiple other components. Some of which are directly bound to the style via the name using titles like `Primary` or `Secondary`.

  - `<ButtonBase />`
  - `<ButtonPrimary />`
  - `<ButtonSecondary />`
  - `<ButtonIcon />`
  - `<Link />`

This component list also becomes cumbersome as styles might be similar, and creates confusion during implimentation by product teams. This isn't the best developer experience for our team members.

### How can Vue help

One of the built in elements within Vue is the `<component>` or better know as a [Dynamic Component](https://vuejs.org/guide/essentials/component-basics.html#dynamic-components). With this element we can leverage the special `is` attribute. The `is` attribute can contain the following:

- the name string of a registered component, OR
- the actual imported component object, OR
- the name of regular HTML elements

### Lets build a better button

Now we know how we can start to leverage vue to build a better button. So lets start by introducing the `as` prop. This prop will allow us to alter the root element of our button. I perfer the `as` prop as it reads well, and is easily parsed when doing static analysis on your code base.

> We are going to use `defineComponent` here to have a more structured component for example purposes. You can convert this over to `script setup` as well.

```vue
<script>
import { defineComponent } from 'vue';
  
export default defineComponent({
  name: 'MyButton',
  props: {
    as: {
      type: String,
      default: 'button',
      validator: (val) => ['button', 'a', 'router-link'].includes(val),
    }
  }
})

</script>

<template>
  <component :is="as">
    <slot />
  </component>
</template>
```
As you can see our `as` prop is getting "remapped" to the `is` attribute. Since the goal here is have a more semantic button component with less abstractions we are going to support link elements as well by leveraging a validator to accept valid html elements along with the `router-link` component used by vue router. By defaulting to the `button` element we wont have to apply this prop for every instance.

Lets take a look at how we are going to support stylistic differences next. To achive this we are going to use a `variant` prop. Most design systems have a pretty standard naming convention for supporting variants. These all achive the same results but might use different nomenclature. For this example we will use `primary` and `secondary` as our variants. 

> ***Variants:*** I would recommend that these should typically be in its own standalone file that can be reused between components along with their validator. 

```vue
<script>
import { defineComponent } from 'vue';
  
export default defineComponent({
  name: 'MyButton',
  props: {
    as: {
      type: String,
      default: 'button',
      validator: (val) => ['button', 'a', 'router-link'].includes(val),
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (val) => ['primary', 'secondary'].includes(val),
    }
  },
  computed: {
    genClasses() {
      return [this.$style.button, this.genModifierClasses];
    },
    genModifierClasses() {
      const classes = [];
      
      //Always apply our variant
      classes.push(this.$style[`is-${this.variant}`]);
      
      //TODO Add More modifier classes
      
      return classes;
    },
  },
})
</script>

<template>
  <component :is="as" :class="genClasses">
    <slot />
  </component>
</template>

<style module>
  .button,
  .is-primary {
    background: blue;
  }
  
  .is-secondary {
    background: red;
  }
</style>
```
So we added a good bit of markup for this change lets break it down a bit.

First we define our `variant` props and the validator for these values.

```js
// previous...
variant: {
  type: String,
  default: 'primary',
  validator: (val) => ['primary', 'secondary'].includes(val),
},
// more...
```
The next bit of code is how we are going to use the `variant` prop along with CSS Modules within our component.

First lets start by defining our styles:

```vue
<style module>
  .button,
  .is-primary {
    background: blue;
  }
  
  .is-secondary {
    background: red;
  }
</style>
```

Since we are using CSS Modules here, we now have access to `this.$styles` within our component. We are leveraging this to keep the hashes applied to our modifier classes which are applied in the following computed properities.

```js
computed: {
  genClasses() {
    return [this.$style.button, this.genModifierClasses];
  },
  genModifierClasses() {
    const classes = [];
    
    //Always apply our variant
    classes.push(this.$style[`is-${this.variant}`]);
    
    //TODO Add More modifier classes
    
    return classes;
  },
},
```

`genClasses()` is our `array` of classes that we use with our `:class` attribute.

`genModifierClasses()` builds all of our modifier classes and gets extended as we add more props to the component.

> ***Note:*** This is just an example, if you are going to use this in production I would recommend that you create a util method to generate these classes to keep it DRY.

Finally we can add our `:class` attribute to our `<component>` element and bind it to `genClasses`.

```vue
<template>
  <component :is="as" :class="genClasses">
    <slot />
  </component>
</template>

```

With this very condensed component lets take a look at what this would look like when being used.

```vue
<template>
  <MyButton>Hello World</MyButton>
  <MyButton variant="secondary">Hello World</MyButton>
  <MyButton as="link">Hello World</MyButton>
  <MyButton as="link" variant="secondary">Hello World</MyButton>
  <MyButton as="router-link">Hello World</MyButton>
  <MyButton as="router-link" variant="secondary">Hello World</MyButton>
</templatet>
```
As you can see we have successfully decoupled the stylistic nature of our component from its name. While also providing a way to adjust the markup of the component by leveraging the `as` prop. 

Now lets add support for using our button within a form. This is usally done via the `type` attribute. So lets use that and create our `type` prop.

```vue
<script>
//previous...
type: {
  type: String,
  default: 'button',
  validator: (val) => ['button', 'submit', 'reset'].includes(val),
},
//more...
</script>

<template>
  <component
    :is="as" 
    :class="genClasses"
    :type="type"
  >
    <slot />
  </component>
</template>

```
Now we have a down and dirty way of being able to set the default behavior of the button element. When building components its a good idea to validate props so that an implimentor can't put the component in an undesired state. If you notice currently we can set the `type` attribute and set the `as` prop to be `link`, which would create markup that isn't valid.

Lets combat this by creating some computed properties to help us understand the way in which our button is being configured.

```js
// computed...
isButton() {
  return !this.isLink && !this.isRouterLink;
},
isLink() {
  return this.as === 'link' && has.call(this.$attrs, 'href');
},
isRouterLink() {
  return this.as === 'router-link' && has.call(this.$attrs, 'to');
}
```

> ***Note:*** `has` is a helper for `Object.prototype.hasOwnProperty`

By adding the previous computed values we can check how our button is being configured in reguards to the `as` prop. We are also looking for accompanying attributes to validate the use of `link` and `router-link`.

Now lets update our `type` attribute.

```vue
<template>
  <component
    :is="as" 
    :class="genClasses"
    :type="isButton ? type : null"
  >
    <slot />
  </component>
</template>

```
We can now apply our ternary operator to the `type` attribute. Because the `false` condition is `null` the `type` attribute will not be applied if `isButton` is `false`.

Part 2 Coming Soon.
