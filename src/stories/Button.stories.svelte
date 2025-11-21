<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from '$lib/components/Button.svelte';
  import { fn } from 'storybook/test';

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Example/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: { type: 'select' },
        options: ['primary', 'secondary', 'tertiary'],
      },
      size: {
        control: { type: 'select' },
        options: ['small', 'medium', 'large'],
      },
      disabled: { control: 'boolean' },
    },
    args: {
      onclick: fn(),
    }
  });
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Primary" args={{ variant: 'primary' }}>
  Button
</Story>

<Story name="Secondary" args={{ variant: 'secondary' }}>
  Button
</Story>

<Story name="Tertiary" args={{ variant: 'tertiary' }}>
  Button
</Story>

<Story name="Large" args={{ size: 'large', variant: 'primary' }}>
  Button
</Story>

<Story name="Small" args={{ size: 'small', variant: 'primary' }}>
  Button
</Story>

<Story name="Disabled" args={{ variant: 'primary', disabled: true }}>
  Button
</Story>
