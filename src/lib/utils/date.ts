export function formatDate(timestamp: number): string {
	const date = new Date(timestamp);
	const day = String(date.getDate()).padStart(2, '0');
	const month = date.toLocaleDateString('en-US', { month: 'long' });
	const year = date.getFullYear();
	return `${day} ${month} ${year}`;
}
