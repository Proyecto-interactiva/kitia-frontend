<!-- src/routes/(app)/evaluaciones/+page.svelte -->
<script lang="ts">
    import { base } from '$app/paths';
    import { onMount } from 'svelte';
    import { API_BASE } from '$lib/config';

    type Eval = {
        id: string;
        titulo: string;
        fecha: string;
        puntuacion: number;
        badges: number;
        estado: 'evaluado' | 'en-progreso';
    };

    let evaluaciones: Eval[] = [];
    let loading = true;

    onMount(async () => {
        try {
            // pedir a backend (que internamente usa Groq) las evaluaciones del usuario
            const token = localStorage.getItem('access_token') || '';
            const res = await fetch(`${API_BASE}/evaluaciones/list`,{
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                },
                credentials: 'include', // si usas cookies; si solo usas bearer, puedes quitarlo
                mode: 'cors',
        });
            if (!res.ok) throw new Error(await res.text());
            evaluaciones = await res.json();
            console.log(evaluaciones);
        } catch (e: any) {
            console.error('Error cargando evaluaciones:', e.message);
        } finally {
            loading = false;
        }
    });
</script>

<style>
    .container{max-width:960px;margin:0 auto;padding:16px;}
    .header{background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:16px;}
    .tabs{display:flex;gap:12px;margin-bottom:12px;overflow-x:auto;}
    .tab{padding:8px 12px;border-radius:8px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;font-size:14px;white-space:nowrap;}
    .tab.active{background:#111827;color:#fff;border-color:#111827;}
    .card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:16px;display:grid;gap:8px;}
    .card h3{margin:0;font-size:16px;font-weight:600;}
    .meta{font-size:13px;color:#6b7280;}
    .estado{font-size:12px;font-weight:600;padding:4px 8px;border-radius:6px;align-self:start;}
    .estado.evaluado{background:#111827;color:#fff;}
    .actions{display:flex;gap:8px;margin-top:8px;}
    .btn{border:1px solid #e5e7eb;padding:6px 12px;border-radius:8px;background:#fff;cursor:pointer;font-size:13px;}
    .btn.primary{background:#111827;color:#fff;border-color:#111827;}
</style>

<div class="container">
    <div class="header">
        <strong>¡Bienvenido de nuevo!</strong>
        <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">Accede a tus evaluaciones éticas anteriores y continúa tu progreso profesional.</p>
    </div>

    <h2 style="margin:0 0 12px;font-size:18px;">¡Hola!</h2>
    <p style="margin:0 0 16px;color:#6b7280;font-size:14px;">Revisa y continúa con tus evaluaciones éticas anteriores</p>

    <div class="tabs">
        <div class="tab active">Últimas evaluaciones</div>
        <div class="tab">Principios éticos</div>
        <div class="tab">Herramientas IA</div>
        <div class="tab">KITMU</div>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <h3 style="margin:0;font-size:15px;">Últimas evaluaciones</h3>
        <button class="btn primary">+ Nueva evaluación ética</button>
    </div>

    {#if loading}
        <p>Cargando…</p>
    {:else if evaluaciones.length === 0}
        <p>No tienes evaluaciones todavía.</p>
    {:else}
        {#each evaluaciones as ev}
            <div class="card">
                <div style="display:flex;justify-content:space-between;align-items:start;">
                    <div>
                        <h3>{ev.nombre}</h3>
                        <p class="meta">Evaluado: { new Date(ev.createdAt).toLocaleDateString(
                            'es-CL',
                            { year: 'numeric', month: 'long', day: 'numeric' }
                        )}</p>
                        <p class="meta">Etapa: {ev.etapa}</p>
                        <p class="meta">Descripción: {ev.descripcion}</p>
                    </div>

                </div>

                <div style="font-size:13px;">
                    <strong><span class="estado {ev.estado}">{ev.estado === 'evaluado' ? 'Evaluado' : 'En progreso'}</span></strong>
                </div>

                <div class="actions">
                    <button class="btn" on:click={() => window.location.href = `${base}/evaluaciones/${ev._id}/checklist`}>Editar</button>
                    <button class="btn" on:click={() => window.location.href = `${base}/evaluaciones/${ev._id}/resultados`}>Ver resultados</button>
                </div>
            </div>
        {/each}
    {/if}
</div>
