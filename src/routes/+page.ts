// src/routes/+layout.ts
import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export const load: LayoutLoad = ({ url, data }) => {
    // data viene del layout.server si le pasas user en el return
    const user = data?.user;
    console.log('layout load user:', user);

    // solo si está en raíz
    if (url.pathname === `${base}/`) {
        if (!user) {
            // sin sesión -> a login
            throw redirect(302, `${base}/login`);
        } else {
            // con sesión -> al home privado
            throw redirect(302, `${base}/inicio`);
        }
    }

    return {};
};
