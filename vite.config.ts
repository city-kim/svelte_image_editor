import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from 'path'

const config: UserConfig = {
	resolve: {
		alias: {
      '$src': path.resolve('./src/'),
      '$component': path.resolve('./src/components')
		},
	},
	plugins: [sveltekit()]
};

export default config;
