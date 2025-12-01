// place files you want to import through the `$lib` alias in this folder.

export { default as DarkModeToggle } from '$lib/components/DarkModeToggle.svelte';
export { default as Modal } from '$lib/components/Modal.svelte';
export { default as Toaster } from '$lib/components/Toaster.svelte';
export { default as Toast } from '$lib/components/Toast.svelte';
export { getTheme, setTheme, initializeTheme } from './stores/theme.svelte';
export {
	toast,
	toastInfo,
	toastSuccess,
	toastWarning,
	toastError,
	addToast,
	removeToast,
	clearAllToasts,
	getToasts,
	pauseToast,
	resumeToast,
	type Toast as ToastData,
	type ToastType
} from './stores/notifications.svelte';
