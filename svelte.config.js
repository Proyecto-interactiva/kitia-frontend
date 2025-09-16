import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.argv.includes('localdev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter({
            // GitHub Pages necesita 404.html como fallback SPA
            fallback: '404.html'
        }),
        // base sólo en prod, con el nombre exacto del repo (sin slash final)
        paths: {
            base: dev ? '' : '/kitia-frontend'
        },
        // Para SPA puro (sin prerender de rutas)
        prerender: { entries: ['*', '/inicio'] }
    }
};

export default config;
