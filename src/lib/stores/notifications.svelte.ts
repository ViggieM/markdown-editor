// ABOUTME: Toast notification state management with queue and pause/resume support
// ABOUTME: Uses Svelte 5 runes for reactive state with 3-toast limit and auto-dismiss

/**
 * Toast Notification System
 *
 * A minimal toast notification system with auto-dismiss, queue management, and pause-on-hover.
 *
 * Features:
 * - Auto-dismiss after 5 seconds (configurable)
 * - Manual close with × button
 * - Pause on hover (timer pauses when hovering)
 * - Maximum 3 toasts visible (others queued)
 * - Bottom-right corner positioning
 * - Slide-in animation from right
 * - Full dark mode support
 * - SSR-safe
 *
 * @example Basic Usage
 * ```typescript
 * import { toastSuccess, toastError, toastWarning, toastInfo } from '$lib';
 *
 * // Simple notifications
 * toastSuccess('Document saved successfully!');
 * toastError('Failed to load document');
 * toastWarning('You have unsaved changes');
 * toastInfo('File is read-only');
 * ```
 *
 * @example Custom Duration
 * ```typescript
 * import { toast } from '$lib';
 *
 * // Custom duration (in milliseconds)
 * toast('Quick toast', 'info', 2000);      // 2 seconds
 * toast('Long toast', 'warning', 10000);   // 10 seconds
 * ```
 *
 * @example Advanced Usage
 * ```typescript
 * import { addToast, removeToast } from '$lib';
 *
 * // Add toast with custom configuration
 * const toastId = addToast({
 *   type: 'warning',
 *   message: 'This action cannot be undone',
 *   duration: 10000,
 *   dismissible: true
 * });
 *
 * // Manually remove a toast
 * removeToast(toastId);
 *
 * // Clear all toasts
 * clearAllToasts();
 * ```
 *
 * @example Real-World Integration
 * ```typescript
 * // In a save handler
 * async function onSave() {
 *   try {
 *     await fileStore.save(selectedFile, documentName, fileContent);
 *     toastSuccess('Document saved successfully!');
 *   } catch (error) {
 *     toastError('Failed to save document');
 *   }
 * }
 *
 * // In a delete handler
 * async function onDelete() {
 *   try {
 *     await fileStore.deleteFile(selectedFile);
 *     toastSuccess('Document deleted');
 *   } catch (error) {
 *     toastError('Failed to delete document');
 *   }
 * }
 *
 * // Warning for unsaved changes
 * if (hasUnsavedChanges) {
 *   toastWarning('You have unsaved changes');
 * }
 * ```
 *
 * @example Queue Behavior
 * ```typescript
 * // Only 3 toasts visible at once, others are queued
 * toastInfo('Toast 1');    // Visible
 * toastSuccess('Toast 2'); // Visible
 * toastWarning('Toast 3'); // Visible
 * toastError('Toast 4');   // Queued (will appear after one dismisses)
 * toastInfo('Toast 5');    // Queued
 * ```
 */

import { browser } from '$app/environment';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
	id: string;
	type: ToastType;
	message: string;
	duration?: number;
	dismissible?: boolean;
}

interface ToastInternal extends Toast {
	isClosing: boolean;
	startTime?: number; // Track when toast was added for pause/resume
	remainingTime?: number; // Track remaining time when paused
}

// Private reactive state
let toasts = $state<ToastInternal[]>([]);
let queue = $state<Toast[]>([]);
const timers = new SvelteMap<string, number>();
const pausedToasts = new SvelteSet<string>();

const MAX_VISIBLE_TOASTS = 3;
const DEFAULT_DURATION = 5000;

// Helper to generate unique IDs
function generateId(): string {
	return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to process queue
function processQueue() {
	if (queue.length > 0 && toasts.length < MAX_VISIBLE_TOASTS) {
		const nextToast = queue.shift();
		if (nextToast) {
			addToastInternal(nextToast);
		}
	}
}

// Internal add function
function addToastInternal(config: Omit<Toast, 'id'> & { id?: string }): string {
	const id = config.id || generateId();
	const duration = config.duration ?? DEFAULT_DURATION;
	const dismissible = config.dismissible ?? true;

	const toast: ToastInternal = {
		id,
		type: config.type,
		message: config.message,
		duration,
		dismissible,
		isClosing: false,
		startTime: browser ? Date.now() : undefined,
		remainingTime: duration
	};

	toasts.push(toast);

	// Setup auto-dismiss timer
	if (browser && duration > 0) {
		const timer = window.setTimeout(() => {
			removeToast(id);
		}, duration);
		timers.set(id, timer);
	}

	return id;
}

// Exported getters
export function getToasts(): ToastInternal[] {
	return toasts;
}

// Core API
export function addToast(config: Omit<Toast, 'id'> & { id?: string }): string {
	// If at max capacity, add to queue
	if (toasts.length >= MAX_VISIBLE_TOASTS) {
		const queuedToast: Toast = {
			id: config.id || generateId(),
			type: config.type,
			message: config.message,
			duration: config.duration ?? DEFAULT_DURATION,
			dismissible: config.dismissible ?? true
		};
		queue.push(queuedToast);
		return queuedToast.id;
	}

	return addToastInternal(config);
}

export async function removeToast(id: string): Promise<void> {
	const toastIndex = toasts.findIndex((t) => t.id === id);
	if (toastIndex === -1) return;

	// Set closing state for animation
	toasts[toastIndex].isClosing = true;

	// Clear any existing timer
	const timer = timers.get(id);
	if (timer) {
		clearTimeout(timer);
		timers.delete(id);
	}

	// Remove from paused set if present
	pausedToasts.delete(id);

	// Wait for animation to complete
	await new Promise((resolve) => setTimeout(resolve, 200));

	// Remove from array
	const index = toasts.findIndex((t) => t.id === id);
	if (index !== -1) {
		toasts.splice(index, 1);
	}

	// Process queue if available
	processQueue();
}

export function pauseToast(id: string): void {
	if (!browser) return;

	const toast = toasts.find((t) => t.id === id);
	if (!toast || pausedToasts.has(id)) return;

	// Clear existing timer
	const timer = timers.get(id);
	if (timer) {
		clearTimeout(timer);
		timers.delete(id);
	}

	// Calculate remaining time
	if (toast.startTime && toast.duration) {
		const elapsed = Date.now() - toast.startTime;
		toast.remainingTime = Math.max(0, toast.duration - elapsed);
	}

	pausedToasts.add(id);
}

export function resumeToast(id: string): void {
	if (!browser) return;

	const toast = toasts.find((t) => t.id === id);
	if (!toast || !pausedToasts.has(id)) return;

	pausedToasts.delete(id);

	// Restart timer with remaining time
	const remainingTime = toast.remainingTime ?? toast.duration ?? DEFAULT_DURATION;

	if (remainingTime > 0) {
		toast.startTime = Date.now();
		const timer = window.setTimeout(() => {
			removeToast(id);
		}, remainingTime);
		timers.set(id, timer);
	}
}

export function clearAllToasts(): void {
	// Clear all timers
	timers.forEach((timer) => clearTimeout(timer));
	timers.clear();
	pausedToasts.clear();

	// Clear toasts and queue
	toasts = [];
	queue = [];
}

// Convenience functions
export function toast(
	message: string,
	type: ToastType = 'info',
	duration = DEFAULT_DURATION
): string {
	return addToast({ message, type, duration, dismissible: true });
}

export function toastInfo(message: string, duration?: number): string {
	return toast(message, 'info', duration);
}

export function toastSuccess(message: string, duration?: number): string {
	return toast(message, 'success', duration);
}

export function toastWarning(message: string, duration?: number): string {
	return toast(message, 'warning', duration);
}

export function toastError(message: string, duration?: number): string {
	return toast(message, 'error', duration);
}
