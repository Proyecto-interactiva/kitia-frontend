import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { base } from '$app/paths';
import { API_BASE } from '$lib/config';

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

// array que devuelve la url para cada pilar específico
export const PilaresUrls = [
    { nombre: 'Transparencia y explicabilidad', url: `https://kitmu.cl/sobre-kitia/transparencia-y-explicabilidad/` },
    { nombre: 'Responsabilidad y rendición de cuentas', url: `https://kitmu.cl/sobre-kitia/responsabilidad-y-rendicion-de-cuentas/` },
    { nombre: 'Privacidad y protección de datos', url: `https://kitmu.cl/sobre-kitia/privacidad-y-proteccion-de-datos/` },
    { nombre: 'No discriminación y equidad', url: `https://kitmu.cl/sobre-kitia/no-discriminacion-y-equidad/` },
    { nombre: 'Seguridad y prevención de daños', url: `https://kitmu.cl/sobre-kitia/seguridad-y-prevencion-de-danos/` },
    { nombre: 'Autonomía humana y control editorial', url: `https://kitmu.cl/sobre-kitia/autonomia-humana-y-control-editorial/` },
    { nombre: 'Veracidad y lucha contra la desinformación', url: `https://kitmu.cl/sobre-kitia/veracidad-y-lucha-contra-la-desinformacion/` },
    { nombre: 'Pluralismo y diversidad informativa', url: `https://kitmu.cl/sobre-kitia/pluralismo-y-diversidad-informativa/` }
];

export const load: PageLoad = async ({ params, fetch }) => {
    const { id } = params;
    const res = await fetch(`${API_BASE}/evaluaciones/${id}/resultados`);
    if (!res.ok) {
        throw error(res.status, await res.text());
    }

    const data: ResultadosData = await res.json();
    console.log('Fetched resultados for evaluation id:', data );
    return { dataset: data };
};

// No prerender, debe ser dinámico (depende de cookies/proxy)
export const prerender = false;
