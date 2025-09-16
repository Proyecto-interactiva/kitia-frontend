import type { RequestHandler } from '@sveltejs/kit';
import { API_BASE } from '$lib/config';

export const GET: RequestHandler = ({ params, url, fetch, request }) =>{
    console.log(API_BASE)
    console.log(params.path)
    const headers = new Headers({
        'content-type': 'application/json'
    });
    return fetch(`${API_BASE}/${params.path}?${url.searchParams}`, {
        method: 'GET',
        headers,
        credentials: 'include',
        mode: 'cors'
    });
}

export const POST: RequestHandler = async ({ params, request, fetch }) => {
    const body = await request.text();
    console.log(API_BASE)
    return fetch(`${API_BASE}/${params.path}`, {
        method: 'POST',
        headers: {
            'content-type': request.headers.get('content-type') ?? 'application/json'
        },
        body,
        credentials: 'include',
        mode: 'cors'
    });
};


export const PUT: RequestHandler = async ({ params, request, fetch }) => {
    const body = await request.text();
    return fetch(`${API_BASE}/${params.path}`, {
        method: 'PUT',
        headers: request.headers,
        body,
        credentials: 'include',
        mode: 'cors'
    });
};


export const DELETE: RequestHandler = ({ params, fetch }) =>
    fetch(`${API_BASE}/${params.path}`, { method: 'DELETE', credentials: 'include', mode: 'cors' });