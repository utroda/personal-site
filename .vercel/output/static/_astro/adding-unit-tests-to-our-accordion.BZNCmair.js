const e="adding-unit-tests-to-our-accordion.md",t="post",n="adding-unit-tests-to-our-accordion",o=`
> This is Part 2 of our series on the "TheAccordion". If you haven't seen [Part 1]() please start there.

In this post, we're focusing on unit testing our "TheAccordion" component using Vitest and Vue Test Utils. We'll walk through setting up a test file and writing tests for general rendering and keyboard navigation. Let's dive right in!

## Setting Up The Test File

First, let's create a file named \`TheAccordion.spec.js\`. We'll start by importing Vitest, \`shallowMount\` from Vue Test Utils, and then our component.

\`\`\`js title="TheAccordion.spec.js"

import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import TheAccordion from '../TheAccordion.vue'
\`\`\`
At this point, you might ask why choose \`shallowMount\` over \`mount\`. Shallow mounting renders only the target component, without mounting its child components. This approach helps keep tests focused and efficient, as it reduces unnecessary complexity and improves test performance. By isolating the component under test, \`shallowMount\` allows for more targeted and straightforward unit tests, resulting in clearer and more maintainable testing suites. This isn't so apparent with a single test like in our example here, but in a production environment where you might have hundreds of tests, the speed gains will be noticeable.
### Setting up defaults

\`\`\`js
const defaultProps = () => ({
  sections: [
    { slug: 's1', heading: 'Section 1', content: 'Content 1' },
    { slug: 's2', heading: 'Section 2', content: 'Content 2' },
    { slug: 's3', heading: 'Section 3', content: 'Content 3' },
  ],
});
\`\`\`

By setting up our \`defaultProps\` as a method that returns an object, we will create a fresh copy of the \`propsData\` for each test. This allows test cases to modify a new object when necessary to test how the component behaves for different props.

So now let's define our suite and set up a reusable render method that we can use.

\`\`\`js
describe('TheAccordion', () => {
  let wrapper;
  let vm;

  const render = (props = {}) => {
    wrapper = shallowMount(TheAccordion, {
      attachTo: document.body,
      propsData: { ...defaultProps(), ...props },
    });
    vm = wrapper.vm;
  }

  beforeEach(() => {
    render();
  });
});
\`\`\`

As you can see, we've now set up our suite of tests called \`TheAccordion\`. All of our other tests will be children of this initial suite set up by the \`describe\` method.

Let's talk about the \`render\` method. This method mounts the component, sets the wrapper, and if necessary gets a reference to the view model. This method takes a single parameter that's an object. Callers can use this parameter to specify custom options to override the default values.

Notice the use of the \`attachTo\` property; this is needed when using \`shallowMount\` to bind our events and to ensure \`isVisible\` has the correct output. See [isVisible from the test utils docs](https://test-utils.vuejs.org/api/#isVisible).

We then leverage \`beforeEach\` so we don't have to call \`render()\` within each test.

### Render Testing

Now that we have the base of our test file set up, let's write the first batch of tests. We will leverage \`describe\` again and build a nested suite of render tests. The rendering suite will test the rendered output of the component, ensuring that the data is fetched when it is mounted and that the data returned is accurately displayed in the component's UI.

\`\`\`js
describe('TheAccordion', () => {
  let wrapper;
  let vm

  // ... render and beforeEach

  describe('Rendering', () => {

    it('renders properly', () => {
      const group = wrapper.find('[data-test-id="accordion-group"]');
      const sections = wrapper.findAll('.accordion');

      expect(group.exists()).toBe(true);
      expect(sections.length).toBe(3);
    })

    it('should have the correct number of panels', () => {
      const panels = wrapper.findAll('.accordion-panel');
      expect(panels.length).toBe(3);
    })

    it('should have the correct number of buttons', () => {
      const buttons = wrapper.findAll('.accordion-button');
      expect(buttons.length).toBe(3);
    })

    it('should render the correct heading element', () => {
      render({ headingAs: 'h2' });

      const headings = wrapper.findAll('h2');
      expect(headings.length).toBe(3);
    })

    it('should render with an initial opened section', async () => {
      render({ initialOpen: 's2' });

      await vm.$nextTick();

      const panels = wrapper.findAll('.accordion-panel');
      expect(panels.at(1).isVisible()).toBe(true);
    });
  });
});
\`\`\`

The tests we've just included should encompass all the rendering states of our component. It's worth noting the use of \`await vm.$nextTick()\` in the test for the initially opened section. This step is essential because it ensures we wait for the DOM to update and render the initial section as opened, guaranteeing accurate test results.

You can also see how we can override default props by using the \`render\` method we set up earlier.

### Behavior Testing

Let's start testing the behavior of our component now. When we first start writing tests, it can be hard to know what to test. A good rule to go by is that we want to test the _external_ behavior of the component, _not_ the internal implementation.

This means in the following tests events are triggered, and the test will verify that the actions are handled properly. We don't want to call internal methods directly like \`toggleSelectedPanel\`. If the method name gets changed, or the params change, it could break our tests.

In the test below, you'll observe multiple nested \`describe\` blocks. This organizational structure enhances the clarity and organization of our test output, making it easier to understand and debug.

\`\`\`js
// ... render tests and previous code

describe('Behavior', () => {
  let panel;
  let button;

  beforeEach(() => {
    panel = wrapper.find('.accordion-panel');
    button = wrapper.find('.accordion-button');
  })

  describe('Mouse Interactions', () => {
    it('should show the panel when a button is clicked', async () => {
      expect(panel.isVisible()).toBe(false);

      await button.trigger('pointerup');

      expect(panel.isVisible()).toBe(true);
    })

    it('should close an opened panel when their respective button is clicked', async () => {
      await button.trigger('pointerup');

      expect(panel.isVisible()).toBe(true);

      await button.trigger('pointerup');

      expect(panel.isVisible()).toBe(false);
    })
  })

  describe('Keyboard Navigation', () => {
    describe('Space Key', () => {
      it('should be possible to show a panel when the Space key is pressed on the respective button', async () => {
        expect(panel.isVisible()).toBe(false);

        await button.trigger('focus');
        await button.trigger('keydown', { code: 'Space' });

        expect(panel.isVisible()).toBe(true);
      })

      it('should be possible to close an already opened panel when the Space key is pressed on the respective button', async () => {
        await button.trigger('pointerup');

        expect(panel.isVisible()).toBe(true);

        await button.trigger('focus');
        await button.trigger('keydown', { code: 'Space' });

        expect(panel.isVisible()).toBe(false);
      })
    })

    describe('Enter Key', () => {
      it('should be possible to show a panel when the Enter key is pressed on the respective button', async () => {
        expect(panel.isVisible()).toBe(false);

        await button.trigger('focus');
        await button.trigger('keydown', { code: 'Enter' });

        expect(panel.isVisible()).toBe(true);
      })

      it('should be possible to close an already opened panel when the Enter key is pressed on the respective button', async () => {
        await button.trigger('pointerup');

        expect(panel.isVisible()).toBe(true);

        await button.trigger('focus');
        await button.trigger('keydown', { code: 'Enter' });

        expect(panel.isVisible()).toBe(false);
      })
    })

    describe('Focus Movement', () => {
      it('should move focus to the last button when "End" is pressed', async () => {
        const lastButton = wrapper.findAll('.accordion-button').at(2);

        await button.trigger('focus');
        await button.trigger('keydown', { code: 'End' });

        expect(lastButton.element).toBe(document.activeElement);
      })

      it('should move focus to the first button when "Home" is pressed', async () => {
        const lastButton = wrapper.findAll('.accordion-button').at(2);

        await lastButton.trigger('focus');
        await lastButton.trigger('keydown', { code: 'Home' });

        expect(button.element).toBe(document.activeElement);
      })

      it('should move focus to the next button when "ArrowDown" is pressed', async () => {

        const secondButton = wrapper.findAll('.accordion-button').at(1);

        await button.trigger('focus');
        await button.trigger('keydown', { code: 'ArrowDown' });

        expect(secondButton.element).toBe(document.activeElement);
      })

      it('should move focus to the previous button when "ArrowUp" is pressed', async () => {
        const secondButton = wrapper.findAll('.accordion-button').at(1);

        await secondButton.trigger('focus');
        await secondButton.trigger('keydown', { code: 'ArrowUp' });

        expect(button.element).toBe(document.activeElement);
      })
    })
  })
});

\`\`\`

***Note the use of \`pointerup\` and \`keydown\` events in the previous tests to match the events we are binding to within the component.***

### A11y Testing

Finally, we need to ensure that the ARIA attributes are being properly set and contain the correct values. This ensures our component adheres to accessibility standards and provides an inclusive user experience.

\`\`\`js
// ... all our previous tests - we are nested within the behavior suite of tests

  describe('a11y', () => {
    it('should have the correct aria attributes', () => {
      expect(button.attributes('aria-expanded')).toBe('false');
      expect(panel.attributes('hidden')).toBeDefined();
    })

    it('should update the aria attributes when the panel is shown', async () => {
      await button.trigger('pointerup');

      expect(button.attributes('aria-expanded')).toBe('true');
      expect(panel.attributes('hidden')).not.toBeDefined();
    })
  })
\`\`\`

## Conclusion

With the completion of our test suite for the component, it's time to put it to the test. Let's run the suite and verify that all our tests pass without any issues!

![unit test output](src/assets/unit-test-output.png)

This wraps up the unit testing for \`TheAccordion\` component, and should provide a good base for setting up tests with Vitest and Vue Test Utils.

[View Repo With Source](https://github.com/utroda/the-accordion)

`,s={title:"Writing Unit Tests with Vue Test Utils and Vitest (Part 2)",description:"Let's add unit tests to our accordion component, using Vue Test Utils and Vitest.",publishDate:new Date(170928e7),draft:!1,tags:["vue","unit testing","testing","vue test utils","vitest"]},i={type:"content",filePath:"/Users/utroda/github/personal-site/src/content/post/adding-unit-tests-to-our-accordion.md",rawData:`
title: "Writing Unit Tests with Vue Test Utils and Vitest (Part 2)"
description: "Let's add unit tests to our accordion component, using Vue Test Utils and Vitest."
publishDate: "01 Mar 2024"
tags: ["Vue", "Unit Testing", "Testing", "Vue Test Utils", "Vitest"]`};export{i as _internal,o as body,t as collection,s as data,e as id,n as slug};
