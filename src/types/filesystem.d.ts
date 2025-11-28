interface Window {
	showDirectoryPicker(options?: DirectoryPickerOptions): Promise<FileSystemDirectoryHandle>;
}

interface FileSystemDirectoryHandle {
	values(): AsyncIterableIteratory<FileSystemHandle>;
}

interface FileSystemHandle {
	remove(): Promise<void>;
}

interface DirectoryPickerOptions {
	id?: string;
	mode?: 'read' | 'readwrite';
	startIn?: 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';
}

interface FileSystemFileHandle {
	move(name: string): Promise<void>;
	move(destinationDirectory: FileSystemDirectoryHandle): Promise<void>;
	move(destinationDirectory: FileSystemDirectoryHandle, newName: string): Promise<void>;
}
