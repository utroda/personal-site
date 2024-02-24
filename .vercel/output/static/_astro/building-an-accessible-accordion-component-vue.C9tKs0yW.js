const e="building-an-accessible-accordion-component-vue.md",n="post",t="building-an-accessible-accordion-component-vue",o=`Accordions are a common UI pattern used to manage content in a collapsible and expandable manner. They are especially useful when dealing with a large amount of information that needs to be organized and presented in a structured way. However, when implementing accordions, it's crucial to ensure accessibility for all users, including those who rely on assistive technologies like screen readers or keyboard navigation. In this blog post, we'll walk through the process of creating an accessible-friendly accordion component using Vue 3, along with writing unit tests to verify its functionality.

## Gather Requirements

Before we start we need to gather some information about the a11y requirements for an Accordion. Thankfully [w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) has some great information for us. Upon reading about the Accordion Pattern we can gather the following:

#### Accordions have two primary sections
- **Accordion Header:** Label for or thmbnail representing a section of content that also serves as a control for showing, and in some implementations, hiding the section of content.
- **Accordion Panel:** Section of content associated with an accordion header.

#### A11y Requirements:

Look at the keyboard interactions required we will need to support the following movements:

- \`Enter\` or \`Space\` will expand the content (panel) could also close the content
- \`Tab\` Moves focus between Headers
- \`Down Arrow\` (optional) - Moves focus to the next header
- \`Up Arrow\` (optional) - Moves focus to the prev header
- \`Home\` (optional) - Moves focus to the first header
- \`End\` (optional) - Moves focus to the last header

We will also need to support the following Aria Properties:

- \`aria-expanded\` - toggle true/false depending on the state of the panel (open/closed)
- \`aria-labelledby\` - set on the panel to refer to the button that controls display of the panel
- \`role=region\` - set on the panel to show panel as a container

At this point I would like to bring attention to the fact W3 doesn't recommend using \`aria-hidden\`. This is somewhat dependant on the implimentation of the component and how we are showing/hiding the panels. The following quote is from [MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden), and describes when not to use \`aria-hidden\`.

> aria-hidden="true" should not be added when:
> - The HTML hidden attribute is present
> - The element or the element's ancestor is hidden with display: none
> - The element or the element's ancestor is hidden with visibility: hidden

You can also view the example directly from the [W3C](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/examples/accordion/#sc1_label) and notic the use of \`hidden\` attribute over \`aria-hidden\` when using CSS directly to control the visibility.

## The Component

developers would utilize to configure the component. This practice enables me to identify any potential shortcomings early in the development process. For instance, in our accordion component, the presence of multiple sections is essential for accommodating various options. While one approach could entail creating two distinct components, such as AccordionGroup and Accordion, promoting composition over props, it inevitably increases the required understanding and documentation regarding the relationship between the components. However, with Vue and named slots, we can achieve the same objective of composition over props, effectively leveraging both strategies concurrently.

#### Define Props and Refs

We will be using the Vue 3 Compisition API via \`script setup\` tag for the following code.

\`\`\`js
  /**
   * Structure of our section object.
   *
   * @typedef {Object} SectionProps
   * @property {string} slug
   * @property {string} heading
   * @property {string} content
  */

  const props = defineProps({
    sections: { type: Array, required: true },
    headingAs: { type: String, default: 'h3' },
    initialOpen: { type: String },
  });

  const accordionGroupEl = ref(null)
  const buttonArray = ref([])
  const currentFocusedIndex = ref(0)
  const currentExpandedIndex = ref(-1)
\`\`\`

So far we have defined the props our component will use. Lets go over these a bit:

- **sections** - An \`array\` of \`objects\` which define our accordion sections.
- **headingAs** - An optional prop that defines the html element used for our heading.
- **initialOpen** - An optional prop that open a panel on initial rendering.

Next lets talk about the reactive properties we defined as these will help us maintain the state of our accordion:

- **accordionGroupEl** - This is a \`ref\` link to the root \`el\` of our component.
- **buttonArray** - This will end up being a \`NodeList\` of our buttons.
- **currentFocusedIndex** - Keep track of focus
- **currentExpandedIndex** - Keep track of what panel is open

#### Markup

\`\`\`html
  <div
    class="accordion-group"
    ref="accordionGroupEl"
    data-test-id="accordion-group"
  >
    <div
      class="accordion"
      v-for="(section, index) in sections"
      :key="section.slug"
    >
      <component
        class="accordion-heading"
        :is="headingAs"
      >
        <button
          class="accordion-button"
          type="button"
          :id="\`\${section.slug}-heading\`"
        >
          <slot :name="\`\${section.slug}-heading\`">
            {{ section.heading }}
          </slot>
        </button>
      </component>

      <div
        class="accordion-panel"
        :id="section.slug"
      >
        <slot :name="\`\${section.slug}-content\`">
          {{ section.content }}
        </slot>
      </div>
    </div>
  </div>
\`\`\`
The markup is pretty sraight forward, we are building the accordion with a parent wrapper \`accordion-group\` we are assigning this a \`ref\` so we can access this root level node. We also give this a \`data-test-id\` that we will use in our unit tests in part 2 (Coming Soon).

Next is the use of \`component\` we are using this here so we can change the element for our \`heading\` by default this will be an \`h3\` but to keep semantic markup we might need to use an \`h2\`, or \`h4\` etc.

In the button and accordion-panel, you'll notice we use named slots with the provided slug. This helps us put together our component in a flexible way giving us back the compoisition over props concept. I like this approach because it gives us options. For instance, if we have simple text sections, we can set them up quickly by just using an array of objects. But if we need more complicated layouts for each section, we can now use these slots. We simply use \`{slug}-heading\` or \`{slug}-content\` depending on what we need.

#### Component Logic

Let start writing some of our logic to handle the interactive of our component. We'll start by setting up the \`onMounted\` hook.

\`\`\`js
onMounted(() => {
  buttonArray.value = accordionGroupEl.value?.querySelectorAll('.accordion-button')

  if(props.initialOpen !== undefined) {
    const index = props.sections.findIndex(section => section.slug === props.initialOpen)
    if(index !== -1) {
      toggleSelectedPanel(index)
    }
  }
});
\`\`\`
In the code snippet above, we're initializing our \`buttonArray\` reference to contain all the elements with the class \`accordion-button\`. Additionally, we're checking whether the \`initialOpen\` prop is specified. If it is, we search for the index of the provided slug within our sections. If we find the index, we trigger the \`toggleSelectedPanel\` method. We'll delve into setting up this method shortly.

\`\`\`js
const handleFocusIn = (event) => {
  currentFocusedIndex.value = Array.prototype.indexOf.call(buttonArray.value, event.target);
}

const toggleSelectedPanel = (index) => {
  currentExpandedIndex.value = currentExpandedIndex.value === index ? -1 : index;
}
\`\`\`
Here, we're introducing two essential functions to manage the behavior of our accordion component. The handleFocusIn function is responsible for tracking the currently focused button within the component, which we'll invoke using the \`@focus\` event handler. Following that, the toggleSelectedPanel method facilitates the opening and closing of panels accordingly. If the currentExpandedIndex is already set to the provided index, we'll close the panel by setting currentExpandedIndex to -1. Conversely, if the index differs, we'll expand the panel by updating currentExpandedIndex to the provided index. These functions are pivotal for ensuring smooth interaction and proper functionality within our accordion component.

Next we'll add some computed properties that will help us keep track of the previous and next indexes. We use \`computed\` here so that \`prevIndex\` and \`nextIndex\` are reactive to when we set \`currerntFocusedIndex\` from the \`handleFocusIn\` method.

\`\`\`js
const nextIndex = computed(() => {
  return currentFocusedIndex.value === buttonArray.value.length - 1
    ? 0
    : currentFocusedIndex.value + 1
});

const prevIndex = computed(() => {
  return currentFocusedIndex.value === 0
    ? buttonArray.value.length - 1
    : currentFocusedIndex.value - 1
});
\`\`\`
All together now we should have a component where our script setup looks like this:

\`\`\`vue
<template>
  <!-- ... component markup -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  sections: { type: Array, required: true },
  headingAs: { type: String, default: 'h3' },
  initialOpen: { type: String },
})

const accordionGroupEl = ref(null)
const buttonArray = ref([]) // Nodelist
const currentFocusedIndex = ref(0)
const currentExpandedIndex = ref(-1)

const nextIndex = computed(() => {
  return currentFocusedIndex.value === buttonArray.value.length - 1
    ? 0
    : currentFocusedIndex.value + 1
});

const prevIndex = computed(() => {
  return currentFocusedIndex.value === 0
    ? buttonArray.value.length - 1
    : currentFocusedIndex.value - 1
});

const handleFocusIn = (event) => {
  currentFocusedIndex.value = Array.prototype.indexOf.call(buttonArray.value, event.target);
}

const toggleSelectedPanel = (index) => {
  currentExpandedIndex.value = currentExpandedIndex.value === index ? -1 : index;
}

onMounted(() => {
  buttonArray.value = accordionGroupEl.value?.querySelectorAll('.accordion-button')

  if(props.initialOpen !== undefined) {
    const index = props.sections.findIndex(section => section.slug === props.initialOpen)
    if(index !== -1) {
      toggleSelectedPanel(index)
    }
  }
});
<\/script>
\`\`\`

Now that we have some of the logic worked out let update our markup to handle events, and visibility of the panels. First lets add the \`@focus\` and \`@pointerup\` events to the \`button\` element. Notice that we are using \`pointerup\` here to handle both click and touch events, you'll need to keep note of this when we get to writing our unit tests in part 2. For more information on \`pointerup\` see [MDN docs here.](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)

\`\`\`vue ins={5-6}
<button
  class="accordion-button"
  type="button"
  :id="\`\${section.slug}-heading\`"
  @focus="handleFocusIn"
  @pointerup="toggleSelectedPanel(index)"
>
  <slot :name="\`\${section.slug}-heading\`">
    {{ section.heading }}
  </slot>
</button>
\`\`\`

Next lets update our \`accordion-panel\` to use v-show:

\`\`\`vue ins={4}
<div
  class="accordion-panel"
  :id="section.slug"
  v-show="currentExpandedIndex === index"
>
  <slot :name="\`\${section.slug}-content\`">
    {{ section.content }}
  </slot>
</div>
\`\`\`

By now your accordion should be working tracking the focus when tabbing into it, along with showing/hiding the panels when clicking on the buttons.

#### Keyboard Events

So back in the [a11y requirements](#a11y-requirements) we noted which keyboard events we will need to support and what should happen upon triggering these events. Lets write a method to handle these events:

\`\`\`js
const handleKeyDown = (event) => {
  if (currentFocusedIndex.value === -1) return;

  const { code } = event;

  switch (code) {
    case 'Home':
      event.preventDefault();
      buttonArray.value[0].focus();
      currentFocusedIndex.value = 0;
    break;
    case 'End':
      event.preventDefault();
      buttonArray.value[buttonArray.value.length - 1].focus();
      currentFocusedIndex.value = buttonArray.value.length - 1;
    break;
    case 'ArrowUp':
    case 'Up':
      event.preventDefault();
      buttonArray.value[prevIndex.value].focus();
    break;
    case 'ArrowDown':
    case 'Down':
      event.preventDefault();
      buttonArray.value[nextIndex.value].focus();
    break;
    case 'Space':
    case 'Enter':
      event.preventDefault();
      toggleSelectedPanel(currentFocusedIndex.value);
  }
}
\`\`\`

Our \`handleKeyUp\` method will be responsible for hanlding all our keyboard events. First we check to see if a button is currently focused within the accordion. If there isn't a focused button we exit early. Next we destructure the \`code\` from the \`event\`, in which our \`switch\` will handle the cases of which key was pressed. All of the following keys \`Home\`, \`End\`, \`ArrowUp\`, and \`ArrowDown\` all adjust which button is focused in the accordion. The \`Space\` and \`Enter\` keys will trigger our \`toggleSelectedPanel\` method.

Additionally, the function prevents the default actions for each key event. You might think we should move the \`event.preventDefault()\` to the root of the method or perhaps use \`.prevent\` on the event handlder defined on the html element but by doing either of these we would break the behavior of the \`Tab\` and possible other keys. This way we only prevent the default action for the keys we are looking for.

So now lets update our component markup to bind to the keyboard events:

\`\`\`vue ins={5}
<button
  class="accordion-button"
  type="button"
  :id="\`\${section.slug}-heading\`"
  @keydown="handleKeyDown"
  @focus="handleFocusIn"
  @pointerup="toggleSelectedPanel(index)"
>
  <slot :name="\`\${section.slug}-heading\`">
    {{ section.heading }}
  </slot>
</button>
\`\`\`

We've opted to use \`keydown\` rather than \`keyup\` in this scenario. The rationale behind this choice is to prevent inadvertent scrolling of the page when the \`Home\` or \`End\` keys are pressed. If we were to bind to \`keyup\`, pressing \`Home\` or \`End\` would trigger page scrolling, potentially shifting the accordion out of view while maintaining focus. By using \`keydown\`, we intercept these key events before the default action (scrolling) occurs, ensuring that the accordion remains in view and focused, thereby enhancing the user experience.

By now we should have a fairly complete component, lets review the full markup to this point:

\`\`\`vue title="TheAccordion.vue"
<template>
  <div
    class="accordion-group"
    ref="accordionGroupEl"
    data-test-id="accordion-group"
  >
    <div
      class="accordion"
      v-for="(section, index) in sections"
      :key="section.slug"
    >
      <component
        class="accordion-heading"
        :is="headingAs"
      >
        <button
          class="accordion-button"
          type="button"
          :id="\`\${section.slug}-heading\`"
          @keydown="handleKeyDown"
          @focus="handleFocusIn"
          @pointerup="toggleSelectedPanel(index)"
        >
          <slot :name="\`\${section.slug}-heading\`">
            {{ section.heading }}
          </slot>
        </button>
      </component>

      <div
        class="accordion-panel"
        :id="section.slug"
        v-show="currentExpandedIndex === index"
      >
        <slot :name="\`\${section.slug}-content\`">
          {{ section.content }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'

  const props = defineProps({
    sections: { type: Array, required: true },
    headingAs: { type: String, default: 'h3' },
    initialOpen: { type: String },
  })

  const accordionGroupEl = ref(null)
  const buttonArray = ref([])
  const currentFocusedIndex = ref(0)
  const currentExpandedIndex = ref(-1)

  const nextIndex = computed(() => {
    return currentFocusedIndex.value === buttonArray.value.length - 1
      ? 0
      : currentFocusedIndex.value + 1
  });

  const prevIndex = computed(() => {
    return currentFocusedIndex.value === 0
      ? buttonArray.value.length - 1
      : currentFocusedIndex.value - 1
  });

  const handleFocusIn = (event) => {
    currentFocusedIndex.value = Array.prototype.indexOf.call(buttonArray.value, event.target);
  }

  const toggleSelectedPanel = (index) => {
    currentExpandedIndex.value = currentExpandedIndex.value === index ? -1 : index;
  }

  const handleKeyDown = (event) => {
    if (currentFocusedIndex.value === -1) return;

    const { code } = event;

    switch (code) {
      case 'Home':
        event.preventDefault();
        buttonArray.value[0].focus();
        currentFocusedIndex.value = 0;
      break;
      case 'End':
        event.preventDefault();
        buttonArray.value[buttonArray.value.length - 1].focus();
        currentFocusedIndex.value = buttonArray.value.length - 1;
      break;
      case 'ArrowUp':
      case 'Up':
        event.preventDefault();
        buttonArray.value[prevIndex.value].focus();
      break;
      case 'ArrowDown':
      case 'Down':
        event.preventDefault();
        buttonArray.value[nextIndex.value].focus();
      break;
      case 'Space':
      case 'Enter':
        event.preventDefault();
        toggleSelectedPanel(currentFocusedIndex.value);
    }
  }

  onMounted(() => {
    buttonArray.value = accordionGroupEl.value?.querySelectorAll('.accordion-button')

    if(props.initialOpen !== undefined) {
      const index = props.sections.findIndex(section => section.slug === props.initialOpen)
      if(index !== -1) {
        toggleSelectedPanel(index)
      }
    }
  });
<\/script>
\`\`\`

#### Aria Support

Finally, we need to add the appropriate ARIA attributes to our HTML elements. For detailed information about which attributes we'll be adding and their significance, please refer to the [a11y requirements](#a11y-requirements) section. These ARIA attributes play a crucial role in ensuring accessibility for users who rely on assistive technologies, enhancing their understanding and navigation of the accordion component.

\`\`\`html ins={5-6} ins={20-22}
 <button
  class="accordion-button"
  type="button"
  :id="\`\${section.slug}-heading\`"
  :aria-expanded="currentExpandedIndex === index"
  :aria-controls="section.slug"
  @keydown="handleKeyUp"
  @focus="handleFocusIn"
  @pointerup="toggleSelectedPanel(index)"
>
  <slot :name="\`\${section.slug}-heading\`">
    {{ section.heading }}
  </slot>
</button>

<!-- other markup -->

<div
  class="accordion-panel"
  role="region"
  :aria-labelledby="\`\${section.slug}-heading\`"
  :hidden="currentExpandedIndex !== index"
  :id="section.slug"
  v-show="currentExpandedIndex === index"
>
  <slot :name="\`\${section.slug}-content\`">
    {{ section.content }}
  </slot>
</div>
\`\`\`

## Conclusion

To wrap up we've covered the process of creating an accessible-friendly accordion component using Vue 3. By following best practices for accessibility and we ensure that our component is not only functional but also inclusive and reliable for all users.

In Part 2 we will cover writing unit tests for accordion component. You can find [part 2 here](/posts/adding-unit-tests-to-our-accordion/).

[View Demo on Vue SFC Playground](https://play.vuejs.org/#eNqtWH1P20YY/yo3d1qCljhQVmlLk7asZSubVtCgfxGkGvsSu1x87vkcQCjffc9zbz4njgWsqFLse95+97y7D8FRUYSrigbjYFLGIiskKamsijeznJBsWXAhyUVKj+KYiyTjOZkLviS9cOQfooLe61mOMjHPS9QRSyCUZEou8ZSQB/1DSMmqxZj0DMfwoDewlJRGSZYj8VwTiUcEvZLmEojv9ROZc2HtAKPmWxv+XdZedlnziN3WXj7S2mGXNY/Ybe3QWsOfK3DzZKQjBTGCF0mXBYskVRGDqJA6Vh/okuPppBFBrW1sQzSdBfZxFiBtpDRNUmGeTvJMZhEjpwXNafJ0fUDLtArU4JEvD65C9Fi72Y+HpCppolxhvPcc20b0CGnpYbupc8Zl+XTlShaEbATIC5fUQ2PWsECKPLiauNy/Cg2ZrFVQ8e+nF7+++u3Va2N0MmqEdYcRkzfOyEWalQT+Le9JXJUSCtVwEJlGEih5T5KEzjOIY2iFJtlyQUoRo3+kLMajEdiJ6TDlLAkzOTp4tT8LjKO2gE0afQCOGvRgEMgSIMyzRfi15Dk0GVUqsyDmyyJjVJwWxp9jW0SzIGKM3/6lzqSoqKkSkElpfNNy/rW8w7NZcCZoScWKzgJHk5FYUKnJx+ef6B08O+KSJxUD7g7iv7TkrEKMmu33Kk8Atsen0J6oRgkBvSiP78Dhpb0UAkVO3SlmATTK9x1Xr+Eehr8ouVm+Bi9uNlvs1s04JNnKpE7MohJzNbICw4XgVWHrQdC5T/wTacfMUpNIRkNJSznMkl06bCbUJluMWoWErIZQwUDqm7wdkCxP6N0e/LiSqLnHN/S+LjSvPTi7YBmzh+eQ1/ak7da2ZzjV2IdUF7AdoSY51aD8upLSFf8u5ZrJ102IvC8oMLWRxsqbX3588O+1thC/bDBHIouG9K6IwE8oF1dCwGWPzckJuo9Mp1PtyDZhLHvBmdeyGp7Uf+/A1Qm/xY6cgmJG/6b3n12eGJ45h07iOP7At5ONy70reAZdRlQF8Em+WDB6ThmYpclZlFPW1/H2hTx/g8dLaL9knEdLdF+HkxpSfkttaae6V6FmP7YjHZw6k0YuldQwNad+ZrdFH+JAXcmoouIMsQu6aKS+DQeLriljNLnG1H5UFozTLEnUsGwN/g918D2gOst2BXw1LFN++4R08h3XHSIzZTZD5AXIziE/QBvhmYzA7W7K2Gf71Jgr8LprV33ABjeAubcsKkjAAeH5P7wC4wlZm90Vl1V/Vy0EL3BR1YPxDN/6piPb/gQtWpX3mBwJEd0PwMi3KhM00R3eLYKutdQC51LAyQC1RxXDHS897DkBbzHaFDE86z0f62bfBthw335eMQZ8lktnuYJqGC6v9shoRD7xhLKsVH1Ts5pkUIXtckGJ7HsK21NGsQ0PGgBzmKKWbIPQ7++R6Rs75QSETORthsNVxMCZmIreDfRpyGi+kCkZkgObMG/JvpsaHep+1hLrvcYHSiHo6jvgdAjePgpyF07DtoGz0XcBa5+uQNzH2QFQZ2sICS45plaoKvx0HsawtfS3AA+IUh7qLQRxqAWkBtPS3BGSmedbkBrp4jB1EW0TAncOD8Bb6mUbhzeuWl2SzUm/O26QtSbAxttW9QP8JlDQoFepdeTyNpNxCnqBvFd/8cVRSUnvI1/S3rhubdqPmGPw+0FXfl87VP9t+R4/CtSsbbB1xXbf8V0LGt24N43oOE/+J6CufH4q1i5dndcAEX77uaivoo/9k2ddzpW/ft++z04wH2Bj2oTTPHsWINc3nwLovIAPtU0wx7iLPQlN2862M5pWUA1yU5VuxjY76NYtIRM2B5gmvA2/VVTcawhcHEF36oWb23bPDBqs774a2tDP3PhUOxF8nemvW79CVV3rtjLVwz60cz0EZn05+3WC8P3lRnWLLWNqNBokWjNax6bizLa71azChscsQ9qV6Fjvf3aC9X94Bk03)

[View Repo With Source](https://github.com/utroda/the-accordion)

`,i={title:"Building an accessible accordian component with Vue (Part 1)",description:"Let's build an accessible accordian componet with Vue.js and meet the spec for W3C.",publishDate:new Date(170928e7),draft:!0,tags:["vue","accessiblity","component"]},r={type:"content",filePath:"/Users/utroda/github/personal-site/src/content/post/building-an-accessible-accordion-component-vue.md",rawData:`
title: "Building an accessible accordian component with Vue (Part 1)"
description: "Let's build an accessible accordian componet with Vue.js and meet the spec for W3C."
publishDate: "01 Mar 2024"
tags: ["Vue", "Accessiblity", "Component"]
draft: true`};export{r as _internal,o as body,n as collection,i as data,e as id,t as slug};
