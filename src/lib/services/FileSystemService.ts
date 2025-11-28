import { fileSave } from 'browser-fs-access';

export interface IFileSystemService {
	selectDirectory(): Promise<FileSystemDirectoryHandle>;
	readFile(handle: FileSystemFileHandle): Promise<string>;
	writeFile(handle: FileSystemFileHandle, content: string): Promise<void>;
	deleteFile(handle: FileSystemFileHandle): Promise<void>;
	renameFile(handle: FileSystemFileHandle, newName: string): Promise<File>;
}

export class BrowserFileSystemService implements IFileSystemService {
	async selectDirectory() {
		return window.showDirectoryPicker({
			id: 'my-markdown-editor',
			mode: 'readwrite',
			startIn: 'documents'
		});
	}

	async readFile(handle: FileSystemFileHandle) {
		const file = await handle.getFile();
		return file.text();
	}

	async writeFile(handle: FileSystemFileHandle, content: string): Promise<void> {
		const blob = new Blob([content], { type: 'text/markdown' });
		await fileSave(blob, {}, handle);
	}

	async deleteFile(handle: FileSystemFileHandle): Promise<void> {
		await handle.remove();
	}

	async renameFile(handle: FileSystemFileHandle, newName: string): Promise<File> {
		await handle.move(newName);
		const updatedFile = await handle.getFile();
		return Object.assign(updatedFile, { handle });
	}
}
