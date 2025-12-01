import { type FileWithHandle } from 'browser-fs-access';
import { BrowserFileSystemService, type IFileSystemService } from '$lib/services/FileSystemService';

class Editor {
	markdownFiles: FileWithHandle[];
	selectedFileIdx: number;
	directoryHandle: FileSystemDirectoryHandle | null;

	constructor(private fileSystem: IFileSystemService = new BrowserFileSystemService()) {
		this.markdownFiles = $state([]);
		this.selectedFileIdx = $state(-1);
		this.directoryHandle = $state(null);
	}

	async loadFiles() {
		this.directoryHandle = await this.fileSystem.selectDirectory();
		if (!this.directoryHandle) return;

		await this.readDirectory(this.directoryHandle, this.markdownFiles);
		// Filter for markdown files
		this.markdownFiles = this.markdownFiles.filter(
			(blob) => blob.name.endsWith('.md') || blob.name.endsWith('.markdown')
		);
	}

	async readDirectory(directoryHandle: FileSystemDirectoryHandle, files: FileWithHandle[]) {
		for await (const entry of directoryHandle.values()) {
			if (entry.kind === 'file') {
				const file = await entry.getFile();
				files.push(Object.assign(file, { handle: entry }));
			}
		}
	}

	async readFile(file: FileWithHandle) {
		return file.handle ? await (await file.handle.getFile()).text() : await file.text();
	}

	async select(file: FileWithHandle | null) {
		if (!file) {
			this.selectedFileIdx = -1;
			return;
		}

		if (!file.handle) return;
		this.selectedFileIdx = await this.findFileIndexByHandle(file.handle);
	}

	async save(file: FileWithHandle, name: string, content: string) {
		if (!file.handle) return;
		await this.fileSystem.writeFile(file.handle, content);
		if (file.name !== name) {
			const updatedFile = await this.fileSystem.renameFile(file.handle, name);
			this.markdownFiles[this.selectedFileIdx] = updatedFile;
		}
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

	async createNewFile() {
		if (!this.directoryHandle) return;

		const fileNames = this.markdownFiles.map((file) => file.name);
		let newFileName = 'Untitled';
		let i = 0;
		while (true) {
			if (fileNames.includes(`Untitled${i === 0 ? '' : String(i)}.md`)) {
				i += 1;
				continue;
			} else {
				newFileName = `Untitled${i === 0 ? '' : String(i)}`;
				break;
			}
		}

		const newFileHandle = await this.directoryHandle.getFileHandle(`${newFileName}.md`, {
			create: true
		});
		const newFile = await newFileHandle.getFile();
		const fileWithHandle = Object.assign(newFile, { handle: newFileHandle });
		this.markdownFiles.push(fileWithHandle);
		await this.select(fileWithHandle);
	}

	async deleteFile(file: FileWithHandle) {
		if (!file.handle) return;

		await this.fileSystem.deleteFile(file.handle);
		const fileIndex = await this.findFileIndexByHandle(file.handle);
		if (fileIndex !== -1) {
			this.markdownFiles.splice(fileIndex, 1);
		}
		this.select(null);
	}
}

export const fileStore = new Editor();
