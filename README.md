# Fabric-UI
A package that contains a big set of useful and beautiful react components and is the basis for many other packages.

*mfc-core* is dead, long live Fabric-UI.

## Installation

```sh
// with npm
npm i @f-ui/core

// with yarn
yarn add @f-ui/core
```

## Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {Fabric, Button} from '@f-ui/core';

function App() {
  return (
    <Fabric language={'en'} theme={'dark'}>
      <Button variant="filled" color="primary">
        Hello World
      </Button>
    </Fabric>
  );
}

ReactDOM.render(<App/>, document.querySelector('#app'));
```

## Additional Dependencies

| Package            | Version | NPM                      | Github                                         |
|--------------------|---------|--------------------------|------------------------------------------------|
| react-input-mask   | ^2.0.4  | npm i react-input-mask   | https://github.com/sanniassin/react-input-mask |
| prop-types   | ^15.7.2  | npm i prop-types   | https://github.com/facebook/prop-types |

## Documentation and examples

### https://fabric-ui.vercel.app/en

**Note**:The package documentation is currently **under development**, any questions can be made through **github**.

## Available components and hooks

- ### Hooks

  - **useCopyToClipboard**: Copy any text to the clipboard.
  - **useFile**: Easy way to read the content from a local file.

- ### Feedback
  - **Alert**: Alert wrapper, ideal for showing any notification.
  - **ToolTip**: Tooltip that doesn't modify the parent layout and super easy to set up inside your system

- ### Inputs

  - **Form**: Form with default layout, data validation and integration with all inputs from the package
  - **FormRow**: Process block for the Form component, facilitates the navigation inside a big complex form.
  - **DateField**: Date field with ability to parse data formats and many input patterns
  - **SelectField**: Basic DropDown component
  - **MultiSelectField**: Multi-select field, supports array or string divided with pattern.
  - **TextField**: A basic text input, customizable with masks (Thanks
    to <a href='https://github.com/sanniassin/react-input-mask'>react-input-mask</a>), Adornments and more.
  - **Button**: Basic button with many beautiful and clean design variants.
  - **Checkbox**: Basic checkbox.
  - **CheckboxGroup**: Group your checkboxes in a wrapper with a clean layout with CheckboxGroup.
  - **FileField**: File upload input, clean, beautiful and easy to use and setup. Manage your uploaded files with
    FileField component.

- ### Navigation
  - **Accordion**: Simple basic accordion.
  - **AccordionSummary**: Accordion summary wrapper.
  - **ScrollStepper**: Replace scroll with vertical steps.
  - **StepperWrapper**: Content wrapper for the ScrollStepper component.
  - **Tab**: Wrapper for your components that will be rendered inside the Tabs or VerticalTabs component.
  - **Tabs**: Beautiful tab system with enter and exit animations.
  - **VerticalTabs**: Vertical tabs system with enter and exit animations.
  - **Modal**: Animated modal window
  - **Dropdown**: A dropdown menu, with everything you would expect.
  - **NavigationRail**: Main vertical bar.
  - **RailActionWrapper**.
  - **RailActionButton**: Minimal dynamic button.
  - **Breadcrumbs**.
  - **Switcher**: Animate enter and exit of content from the visible dom elements.

- ### Data display and visualization
  - **useInfiniteScroll**: Hook for infinite scroll.
  - **Masonry**: Masonry layout list.
  - **Card**: Card compatible with the Masonry component.

- ### Misc
  - **Fabric**: Necessary to load correctly the icons, language and color.
  - **Ripple**: Ripple effect activated with a mouse down event.


## Roadmap

1. Documentation.
   1. Work in progress, most of the basis are available inside de [docs](https://github.com/FacoBackup/fabric-ui/tree/next/docs/en) directory.
2. Bug fixes.
   1. Calendar issue.
