import type { RequestHandler } from '@sveltejs/kit';
import { API_BASE } from '$lib/config';

export const GET: RequestHandler = ({ params, url, fetch, request }) =>
    fetch(`${API_BASE}/${params.path}?${url.searchParams}`, {
        method: 'GET',
        headers: request.headers,
        credentials: 'include'
    });

export const POST: RequestHandler = async ({ params, request, fetch }) => {
    const body = await request.text();
    console.log(API_BASE)
    return fetch(`${API_BASE}/${params.path}`, {
        method: 'POST',
        headers: {
            'content-type': request.headers.get('content-type') ?? 'application/json'
        },
        body,
        credentials: 'include'
    });
};


export const PUT: RequestHandler = async ({ params, request, fetch }) => {
    const body = await request.text();
    return fetch(`${API_BASE}/${params.path}`, {
        method: 'PUT',
        headers: request.headers,
        body,
        credentials: 'include'
    });
};


export const DELETE: RequestHandler = ({ params, fetch }) =>
    fetch(`${API_BASE}/${params.path}`, { method: 'DELETE', credentials: 'include' });