import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { base } from '$app/paths';

type Fort = { id: string; texto: string; puntos: number; pilar: string; impact?: number };
type Mejora = { id: string; texto: string; puntos: number; pilar: string; prioridad: number; esfuerzo: number };
type Resumen = {
    estado: 'excelente' | 'ok' | 'necesita_mejoras' | 'urgente';
    puntos: number;
    puntos_max: number;
    progreso: number; // 0..1
    fortalezas: Fort[];
    mejoras: Mejora[];
};
type PilarScore = { nombre: string; total: number; obtenido: number };
type Tool = { name: string; summary: string; bullets?: string[]; url?: string };

export type ResultadosData = {
    resumen: Resumen;
    pilares: PilarScore[];
    herramientas: Tool[];
};

export const load: PageLoad = async ({ params, fetch }) => {
    const { id } = params;
    const res = await fetch(`${base}/api/evaluaciones/${id}/resultados`);
    if (!res.ok) {
        throw error(res.status, await res.text());
    }

    const data: ResultadosData = await res.json();
    console.log('Fetched resultados for evaluation id:', data );
    return { dataset: data };
};

// No prerender, debe ser dinámico (depende de cookies/proxy)
export const prerender = false;
