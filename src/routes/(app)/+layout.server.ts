// src/routes/(app)/+layout.server.ts  -> layout para rutas privadas
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export const load: LayoutServerLoad = ({ locals }) => {
    console.log('layout.server load locals:', locals);
    if (!locals.user) throw redirect(302, `${base}/login`);
    return { user: locals.user };
};