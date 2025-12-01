import { defineConfig, mergeConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { playwright } from '@vitest/browser-playwright';

import viteConfig from './vite.config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			exclude: ['**/node_modules/**', '**/e2e/**'],
			projects: [
				{
					plugins: [
						storybookTest({
							configDir: path.join(dirname, '.storybook'),
							storybookScript: 'pnpm exec storybook --no-open'
						})
					],
					test: {
						name: 'storybook',
						browser: {
							enabled: true,
							provider: playwright({}),
							headless: true,
							instances: [{ browser: 'chromium' }]
						},
						setupFiles: ['./.storybook/vitest.setup.ts']
					}
				}
			]
		}
	})
);
