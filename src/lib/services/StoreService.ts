// ABOUTME: Storage service abstraction providing a testable, SSR-safe interface over browser storage APIs.
// ABOUTME: Includes LocalStorageService for browser environments and NoOpStorageService for server-side rendering.
export interface IStoreService {
	set<T>(key: string, value: T): Promise<void>;
	get<T>(key: string): Promise<T | null>;
	remove(key: string): Promise<void>;
	clear(): Promise<void>;
	has(key: string): Promise<boolean>;
}

export class LocalStorageService implements IStoreService {
	async set<T>(key: string, value: T) {
		localStorage.setItem(key, JSON.stringify(value));
	}
	async get(key: string) {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : null;
	}
	async remove(key: string): Promise<void> {
		localStorage.removeItem(key);
	}

	async clear(): Promise<void> {
		localStorage.clear();
	}

	async has(key: string): Promise<boolean> {
		return localStorage.getItem(key) !== null;
	}
}

export class NoOpStorageService implements IStoreService {
	async set<T>(_key: string, _value: T) {}
	async get<T>(_key: string): Promise<T | null> {
		return null;
	}
	async remove(_key: string) {}
	async clear() {}
	async has(_key: string) {
		return false;
	}
}

export function createStorageService(): IStoreService {
	if (typeof window !== 'undefined' && window.localStorage) {
		return new LocalStorageService();
	}
	return new NoOpStorageService();
}
