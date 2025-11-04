// Rutas privadas: todo corre en el cliente (SPA)
import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';

export const ssr = false;      // evita __data.json
export const csr = true;
export const prerender = true; // shell estático

export const load: LayoutLoad = async ({ fetch, url }) => {
    if (!browser) return {}; // no ejecutar en SSR

    // Lee el bearer guardado tras login (o como lo guardes tú)
    const token = localStorage.getItem('access_token');


        // Si no hay token y no estamos ya en login público, redirige
    if (!token && !url.pathname.includes('/login')) {
        throw redirect(302, '/login/');
    }

    return {};
};
