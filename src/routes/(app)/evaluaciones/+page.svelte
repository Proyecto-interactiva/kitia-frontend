<script lang="ts">
    import { base } from '$app/paths';
    import { onMount } from 'svelte';
    import { API_BASE } from '$lib/config';

    type EvaluacionItem = {
        _id: string;
        nombre: string;
        createdAt: string;
        etapa?: string;
        descripcion?: string;
        estado: 'evaluado' | 'en-progreso';
        puntuacion?: number;      // opcional (0-100)
        puntos?: number;          // opcional
        puntos_max?: number;      // opcional
        badges?: number;          // opcional
    };

    let evaluaciones: EvaluacionItem[] = [];
    let loading = true;

    // búsqueda local (no cambia nada del backend)
    let q = '';
    $: filtered = evaluaciones.filter((ev) => {
        const hay = (s?: string) => (s || '').toLowerCase().includes(q.toLowerCase());
        return (
            hay(ev.nombre) ||
            hay(ev.descripcion) ||
            hay(ev.etapa) ||
            new Date(ev.createdAt).toLocaleDateString('es-CL').includes(q)
        );
    });

    onMount(async () => {
        try {
            const token = localStorage.getItem('access_token') || '';
            const res = await fetch(`${API_BASE}/evaluaciones/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                credentials: 'include',
                mode: 'cors'
            });
            if (!res.ok) throw new Error(await res.text());
            evaluaciones = await res.json();
        } catch (e) {
            console.error('Error cargando evaluaciones:', e);
        } finally {
            loading = false;
        }
    });

    const fmtFecha = (iso: string) =>
        new Date(iso).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });

    const scoreTxt = (ev: EvaluacionItem) => {
        if (ev.puntos !== undefined && ev.puntos_max !== undefined) return `${ev.puntos}/${ev.puntos_max} pts`;
        if (ev.puntuacion !== undefined) return `${ev.puntuacion} pts`;
        return null;
    };

    const scorePct = (ev: EvaluacionItem) => {
        if (ev.puntos !== undefined && ev.puntos_max) return Math.round((ev.puntos / ev.puntos_max) * 100);
        if (ev.puntuacion !== undefined) return Math.max(0, Math.min(100, Math.round(ev.puntuacion)));
        return null;
    };
</script>

<style>
    :root{
        --cream:#f7efd2;
        --ink:#1f2937;
        --muted:#6b7280;
        --card:#ffffff;
        --line:#ece5d6;

        --rose:#e3a0b7;
        --yellow:#e9bf3c;
        --green:#37b56f;

        --shadow-lg:0 22px 50px rgba(0,0,0,.16);
        --shadow:0 14px 28px rgba(0,0,0,.12);
        --radius:22px;
    }

    .page{ background: var(--cream); min-height: 100dvh; }
    .container{ max-width: 1120px; margin: 0 auto; padding: clamp(12px,3.6vw,26px); }

    /* HERO */
    .hero{
        display:grid; grid-template-columns: 1fr auto; align-items:center; gap:16px;
        background:#fff; border:1px solid var(--line); border-radius: var(--radius);
        padding: 18px; margin-bottom: 18px;
        position: relative; overflow: hidden;
    }

    .hero h2{ margin:0; font-size: clamp(22px, 3.8vw, 32px); color: var(--ink); }
    .hero p{ margin:4px 0 0; color: var(--muted) }

    .btn{
        border: 1px solid var(--line); background:#fff; color:#374151; font-weight:800;
        padding: 12px 16px; border-radius: 999px; cursor:pointer; box-shadow: 0 6px 14px rgba(0,0,0,.08);
    }
    .btn.primary{
        border:0; color:#5b4705;
        background: linear-gradient(180deg, #f7e2a0, #f0c95c);
    }

    /* Tabs pills */
    .tabs{ display:flex; gap:12px; margin: 12px 0 14px; overflow-x:auto; }
    .tab{
        padding:10px 14px; border-radius: 999px; white-space:nowrap; font-weight:800;
        background:#fff; border:1px solid var(--line); box-shadow: 0 10px 18px rgba(0,0,0,.06);
    }
    .tab.active{ background: linear-gradient(180deg, #e8b9c9, var(--rose)); color:#fff; border:0; }

    /* Search */
    .toolbar{ display:flex; gap:12px; justify-content:space-between; align-items:center; margin: 6px 0 14px; }
    .search{
        flex:1; display:flex; align-items:center; gap:10px;
        background:#fff; border:1px solid var(--line); border-radius: 14px; padding: 10px 12px;
        box-shadow: 0 10px 18px rgba(0,0,0,.06);
    }
    .search input{ border:0; outline:none; flex:1; font-size:14px; }

    /* Grid de tarjetas */
    .grid{ display:grid; gap: 16px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    @media (max-width: 900px){ .grid{ grid-template-columns: 1fr; } }

    .card{
        position: relative;
        background:#fff; border:1px solid var(--line); border-radius: var(--radius);
        padding: 16px 16px 14px 16px; display:grid; gap: 12px; box-shadow: var(--shadow);
        overflow:hidden;
    }

    .head{ display:flex; justify-content:space-between; align-items:flex-start; gap: 12px; }
    .title{ margin:0; font-size: 18px; font-weight: 900; color:#222; letter-spacing:.2px; margin-bottom:20px; }
    .meta{ margin: 0; font-size: 13px; color: var(--muted); }

    .chips{ display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
    .chip{
        font-size:12px; font-weight:800; border-radius:999px; padding:6px 10px; white-space:nowrap;
        border:1px solid var(--line); background:#f9fafb;
    }
    .chip.state-evaluado{ background:#111827; color:#fff; border-color:#111827; }
    .chip.state-progreso{ background:#fff7d6; color:#6a5408; border-color:#f3e6bf; }
    .chip.score{ background:#ebfdf5; color:#065f46; border-color:#ccf5e7; }

    .desc{ color:#374151; margin: 0; line-height:1.45; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }

    /* progreso dentro de la card */
    .progress{ height: 8px; background:#f3f4f6; border:1px solid #e5e7eb; border-radius:999px; overflow:hidden; }
    .bar{ height:100%; background: linear-gradient(90deg, #b9f0cf, #37b56f); }

    .foot{ display:flex; justify-content:space-between; align-items:center; gap:8px; }
    .actions{ display:flex; gap:8px; flex-wrap:wrap; }
    .btn.secondary{ background:#fff; }

    /* Empty / loading */
    .empty{
        background:#fff; border:1px solid var(--line); border-radius: 18px;
        padding: 26px; text-align:center; color: var(--muted); box-shadow: var(--shadow);
    }

    /* Skeleton */
    .skeleton{ height:140px; border-radius: var(--radius); background: linear-gradient(90deg,#eee,#f5f5f5,#eee); animation: shine 1.4s infinite; border:1px solid #eaeaea; }
    @keyframes shine{ 0%{background-position:-200px 0} 100%{background-position:calc(200px + 100%) 0} }
</style>

<div class="page">
    <div class="container">

        <!-- HERO -->
        <section class="hero">
            <div>
                <h2>¡Hola!</h2>
                <p>Revisa y continúa con tus evaluaciones éticas anteriores.</p>
            </div>
            <button class="btn primary" on:click={() => (window.location.href = `${base}/evaluaciones/nueva`)}>+ Nueva evaluación ética</button>
        </section>

        <!-- TABS -->

        <!-- Toolbar -->
        <div class="toolbar">
            <div class="search">
                <span aria-hidden="true">🔎</span>
                <input placeholder="Buscar por nombre, descripción, etapa o fecha…" bind:value={q} />
            </div>
        </div>

        {#if loading}
            <div class="grid" aria-busy="true" aria-live="polite">
                <div class="skeleton"></div>
                <div class="skeleton"></div>
            </div>
        {:else if filtered.length === 0}
            <div class="empty">
                {#if q}
                    No encontramos evaluaciones que coincidan con “<strong>{q}</strong>”.
                {:else}
                    Aún no tienes evaluaciones.
                {/if}
                <div style="margin-top:10px;">
                    <button class="btn primary" on:click={() => (window.location.href = `${base}/tutor`)}>Crear una nueva</button>
                </div>
            </div>
        {:else}
            <div class="grid">
                {#each filtered as ev}
                    <article class="card">
                        <div class="head">
                            <div>
                                <h3 class="title">{ev.nombre}</h3>
                                <p class="meta">Fecha: {fmtFecha(ev.createdAt)}</p>
                                {#if ev.etapa}<p class="meta">Etapa: {ev.etapa}</p>{/if}
                            </div>

                        </div>

                        {#if ev.descripcion}<p class="desc">{ev.descripcion}</p>{/if}

                        {#if scorePct(ev) !== null}
                            <div class="progress" aria-label="Progreso">
                                <div class="bar" style={`width:${scorePct(ev)}%`}></div>
                            </div>
                        {/if}

                        <div class="foot">
                            <div class="actions">
                                <button class="btn secondary" on:click={() => (window.location.href = `${base}/evaluaciones/${ev._id}/checklist`)}><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align:middle;">
                                    <path d="M3 17.25V21h3.75l11.06-11.06a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                                </svg> Editar</button>
                                <button class="btn" on:click={() => (window.location.href = `${base}/evaluaciones/${ev._id}/resultados`)}><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align:middle;">
                                    <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5V8h5.5L13 3.5zM6 4h6v5a1 1 0 0 0 1 1h5v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4z" fill="currentColor"/>
                                </svg> Ver resultados</button>
                            </div>
                        </div>
                    </article>
                {/each}
            </div>
        {/if}
    </div>
</div>
