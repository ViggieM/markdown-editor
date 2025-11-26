import { directoryOpen, fileSave, type FileWithHandle } from 'browser-fs-access';

type DirectoryFiles = Awaited<ReturnType<typeof directoryOpen>>;

class Editor {
	isFolderSelected: boolean;
	markdownFiles: DirectoryFiles;
	selectedFile: FileWithHandle | null;
	selectedFileTitle: string;
	selectedFileContent: string;
	initialFileContent: string;

	constructor() {
		this.isFolderSelected = $state(false);
		this.markdownFiles = $state([]);
		this.selectedFile = $state(null);
		this.selectedFileTitle = $state('');
		this.selectedFileContent = $state('');
		this.initialFileContent = $state('');
	}

	async loadFiles() {
		const files = await directoryOpen({
			recursive: true,
			mode: 'readwrite',
			startIn: 'documents',
			id: 'my-markdown-editor',
			skipDirectory: (entry) => entry.name.startsWith('.') // Skip hidden folders
		});
		// Filter for markdown files
		this.markdownFiles = files.filter(
			(blob) => blob.name.endsWith('.md') || blob.name.endsWith('.markdown')
		);
		this.isFolderSelected = true;
	}

	async select(file: FileWithHandle) {
		this.selectedFile = file;
		this.selectedFileTitle = file.name;

		// Get fresh file content from the handle if available
		const content = file.handle
			? await (await file.handle.getFile()).text()
			: await file.text();

		this.initialFileContent = this.selectedFileContent = content;
	}

	async save() {
		if (!this.selectedFile) return;

		const blob = new Blob([this.selectedFileContent], { type: 'text/markdown' });
		const originalName = this.selectedFile.name;
		const hasNameChanged = this.selectedFileTitle !== originalName;

		if (hasNameChanged && this.selectedFile.handle) {
			// Save content to the existing file first
			await fileSave(blob, {}, this.selectedFile.handle, true);

			// Then rename the file using the move() API
			await this.selectedFile.handle.move(this.selectedFileTitle);

			// Update the selectedFile reference to reflect the new file state
			// Preserve the handle since getFile() returns a plain File object
			const handle = this.selectedFile.handle;
			const updatedFile = await handle.getFile();
			this.selectedFile = Object.assign(updatedFile, { handle });

			// Update the file in the markdownFiles array
			if (this.selectedFile.handle) {
				const fileIndex = await this.findFileIndexByHandle(this.selectedFile.handle);
				if (fileIndex !== -1) {
					this.markdownFiles[fileIndex] = updatedFile;
				}
			}
		} else {
			// Normal save without renaming
			await fileSave(blob, {}, this.selectedFile.handle);
		}

		this.initialFileContent = this.selectedFileContent;
	}

	private async findFileIndexByHandle(handle: FileSystemFileHandle): Promise<number> {
		for (let i = 0; i < this.markdownFiles.length; i++) {
			const file = this.markdownFiles[i];
			if (file.handle && (await file.handle.isSameEntry(handle))) {
				return i;
			}
		}
		return -1;
	}
}

export const fileStore = new Editor();
