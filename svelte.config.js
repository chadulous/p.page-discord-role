import adapter from 'sveltekit-adapter-deno';
import { sveltePreprocess } from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sveltePreprocess(),

	kit: {
		adapter: adapter({
			buildOptions: {
				loader: {
					".node": "file",
				},
			},
		})
	}
};

export default config;
