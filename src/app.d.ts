// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// File System Access API extensions
	interface FileSystemFileHandle {
		move(name: string): Promise<void>;
		move(destinationDirectory: FileSystemDirectoryHandle): Promise<void>;
		move(destinationDirectory: FileSystemDirectoryHandle, newName: string): Promise<void>;
	}
}

export {};
