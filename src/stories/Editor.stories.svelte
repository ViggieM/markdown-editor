<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Editor from '$lib/components/Editor.svelte';

	const { Story } = defineMeta({
		title: 'Components/Editor',
		component: Editor,
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen'
		},
		argTypes: {
			markdown: {
				control: 'text',
				description: 'Markdown content to display and edit'
			}
		}
	});

	const sampleMarkdown = `# Welcome to Markdown Editor

Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents.

## How to use this?

1. Write markdown in the left editor
2. See the rendered markdown in the right preview
3. Click the eye icon to toggle the markdown editor visibility

That's it!

### Features

- **Bold text** and *italic text*
- \`Inline code\` and code blocks
- Lists (ordered and unordered)
- [Links](https://example.com)
- And much more!`;

	const longMarkdown = `# Long Content Example

## Introduction

This is a longer document to test the scrolling behavior of both the markdown editor and the preview panel.

## Section 1: Lorem Ipsum

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Subsection 1.1

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Subsection 1.2

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

## Section 2: Code Examples

Here's some inline \`code\` and a code block:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

## Section 3: Lists

### Unordered List

- First item
- Second item
  - Nested item 1
  - Nested item 2
- Third item

### Ordered List

1. First step
2. Second step
3. Third step

## Section 4: Quotes and Links

> "The only way to do great work is to love what you do." - Steve Jobs

Check out [Markdown Guide](https://www.markdownguide.org/) for more information.

## Section 5: Tables

| Feature | Supported |
|---------|-----------|
| Headers | Yes |
| Lists | Yes |
| Code | Yes |
| Tables | Yes |

## Conclusion

This concludes our long content example. You should be able to scroll both the markdown editor and the preview panel independently.`;
</script>

<Story name="Default" args={{ markdown: '' }} />

<Story name="With Content" args={{ markdown: sampleMarkdown }} />

<Story name="Long Content" args={{ markdown: longMarkdown }} />
