import { describe, it, expect } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
	it('formats timestamp correctly', () => {
		const timestamp = new Date('2025-01-15').getTime();
		expect(formatDate(timestamp)).toBe('15 January 2025');
	});
});
