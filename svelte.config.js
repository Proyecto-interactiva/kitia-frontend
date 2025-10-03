import adapter from '@sveltejs/adapter-static';

const isRender = !!process.env.RENDER;      // Render define RENDER=1
const isDev = process.argv.includes('dev');

export default {
    kit: {
        adapter: adapter({ fallback: '404.html' }),
        // En Render y en dev → sin base (raíz). Para GitHub Pages puedes dejar el base aparte.
        paths: { base: (isRender || isDev) ? '' : '/kitia-frontend' },
        prerender: {
            handleUnseenRoutes: 'ignore' // or 'warn'
        }
        // Para SPA puro (sin prerender de rutas)
    },
};