import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const access = event.cookies.get('access_token');
    event.locals.user = access ? { id: 'placeholder' } : null; // opcional: validar en /api/auth/me
    return resolve(event);
};

declare module '@sveltejs/kit' {
    interface Locals { user: { id: string } | null }
}
