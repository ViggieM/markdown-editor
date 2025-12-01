<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DocumentList from '$lib/components/DocumentList.svelte';
	import { fn } from 'storybook/test';
	import type { FileWithHandle } from 'browser-fs-access';

	// Helper function to create mock File objects for Storybook
	function createMockFile(name: string, dateString: string): FileWithHandle {
		const date = new Date(dateString);
		const blob = new Blob([''], { type: 'text/markdown' });
		const file = new File([blob], name, {
			type: 'text/markdown',
			lastModified: date.getTime()
		});
		// Add webkitRelativePath for unique ID
		Object.defineProperty(file, 'webkitRelativePath', {
			value: name,
			writable: false
		});
		return file;
	}

	const exampleFiles = [
		createMockFile('welcome.md', '2022-04-01'),
		createMockFile('untitled-document.md', '2022-04-01'),
		createMockFile('getting-started.md', '2022-03-15'),
		createMockFile('project-notes.md', '2022-03-10')
	];

	const manyFiles = [
		...exampleFiles,
		createMockFile('meeting-minutes.md', '2022-03-05'),
		createMockFile('todo-list.md', '2022-03-02'),
		createMockFile('brainstorming-session.md', '2022-02-28'),
		createMockFile('design-specs.md', '2022-02-25')
	];

	const { Story } = defineMeta({
		title: 'Components/DocumentList',
		component: DocumentList,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
			backgrounds: {
				default: 'dark',
				values: [{ name: 'dark', value: '#35393f' }]
			}
		},
		argTypes: {
			files: { control: 'object' },
			selectedIdx: { control: 'number' },
			onFileSelect: { action: 'file-selected' }
		},
		args: {
			files: exampleFiles,
			onFileSelect: fn((file) => console.log('File selected:', file))
		}
	});
</script>

<Story name="Default" />

<Story name="Empty" args={{ files: [] }} />

<Story name="WithSelection" args={{ files: exampleFiles, selectedIdx: 1 }} />

<Story name="ManyDocuments" args={{ files: manyFiles }} />

<Story name="SingleDocument" args={{ files: [exampleFiles[0]] }} />
