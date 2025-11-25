<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DocumentList from '$lib/components/DocumentList.svelte';
	import { fn } from 'storybook/test';

	const exampleDocuments = [
		{
			id: '1',
			name: 'welcome.md',
			date: '01 April 2022'
		},
		{
			id: '2',
			name: 'untitled-document.md',
			date: '01 April 2022'
		},
		{
			id: '3',
			name: 'getting-started.md',
			date: '15 March 2022'
		},
		{
			id: '4',
			name: 'project-notes.md',
			date: '10 March 2022'
		}
	];

	const manyDocuments = [
		...exampleDocuments,
		{
			id: '5',
			name: 'meeting-minutes.md',
			date: '05 March 2022'
		},
		{
			id: '6',
			name: 'todo-list.md',
			date: '02 March 2022'
		},
		{
			id: '7',
			name: 'brainstorming-session.md',
			date: '28 February 2022'
		},
		{
			id: '8',
			name: 'design-specs.md',
			date: '25 February 2022'
		}
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
			documents: { control: 'object' },
			selectedId: { control: 'text' },
			onDocumentSelect: { action: 'document-selected' }
		},
		args: {
			documents: exampleDocuments,
			onDocumentSelect: fn((document) => console.log('Document selected:', document))
		}
	});
</script>

<Story name="Default" />

<Story name="Empty" args={{ documents: [] }} />

<Story name="WithSelection" args={{ documents: exampleDocuments, selectedId: '2' }} />

<Story name="ManyDocuments" args={{ documents: manyDocuments }} />

<Story name="SingleDocument" args={{ documents: [exampleDocuments[0]] }} />
