import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()]
    // NO base aquí; SvelteKit ya usa kit.paths.base
});
