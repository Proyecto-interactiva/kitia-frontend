<!-- src/routes/(app)/evaluacion/[id]/checklist/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    type Pregunta = {
        id: string;
        texto: string;
        puntos: number;
        critica?: boolean;
        completada: boolean;
        notas?: string;
    };
    type Pilar = {
        id: string;
        nombre: string;
        descripcion: string;
        preguntas: Pregunta[];
    };

    let pilares: Pilar[] = [];
    let loading = true;
    let error = '';

    $: evaluacionId = $page.params.id;

    onMount(async () => {
        try {
            // pedir a backend (que internamente usa Groq) los pilares + checklist
            const res = await fetch(`/api/evaluaciones/${evaluacionId}/checklist`);
            if (!res.ok) throw new Error(await res.text());
            pilares = await res.json();
            console.log(pilares);
            console.log('Evaluacion ID:', res);
        } catch (e: any) {
            error = e.message;
        } finally {
            loading = false;
        }
    });

    function toggle(pilarId: string, preguntaId: string) {
        const pilar = pilares.find(p => p.id === pilarId);
        if (!pilar) return;
        const q = pilar.preguntas.find(q => q.id === preguntaId);
        if (!q) return;
        q.completada = !q.completada;
        // actualizar en backend
        fetch(`/api/evaluaciones/${evaluacionId}/preguntas/${preguntaId}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ completada: q.completada, notas: q.notas ?? '' })
        });
    }

    function updateNotas(pilarId: string, preguntaId: string, notas: string) {
        const pilar = pilares.find(p => p.id === pilarId);
        if (!pilar) return;
        const q = pilar.preguntas.find(q => q.id === preguntaId);
        if (!q) return;
        q.notas = notas;
        fetch(`/api/evaluaciones/${evaluacionId}/preguntas/${preguntaId}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ completada: q.completada, notas })
        });
    }

    function progresoTotal() {
        const todas = pilares.flatMap(p => p.preguntas);
        const comp = todas.filter(q => q.completada).length;
        return { comp, total: todas.length };
    }

    function puntosTotales() {
        return pilares.flatMap(p => p.preguntas).reduce((acc, q) => acc + (q.completada ? q.puntos : 0), 0);
    }
</script>

<style>
    .container{max-width:960px;margin:0 auto;padding:16px;}
    .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:16px;margin-bottom:16px;}
    .pilar-title{font-weight:600;font-size:16px;margin-bottom:8px;}
    .pregunta{border-top:1px solid #e5e7eb;padding:12px 0;}
    .pregunta:first-child{border-top:none;}
    .checkbox{margin-right:8px;}
    .critica{color:#b91c1c;font-size:12px;font-weight:600;margin-left:6px;}
    .nota{width:100%;margin-top:8px;border:1px solid #e5e7eb;border-radius:8px;padding:8px;font-size:13px;}
    .progreso{margin:16px 0;padding:12px;border-radius:10px;background:#f9fafb;border:1px solid #e5e7eb;}
    .badge{font-size:12px;border-radius:8px;padding:2px 6px;margin-left:6px;background:#f3f4f6;}
</style>

<div class="container">
    <h1>Evaluación Ética</h1>

    {#if loading}
        <p>Cargando checklist…</p>
    {:else if error}
        <p style="color:#b91c1c">{error}</p>
    {:else}
        <div class="progreso">
            <div>
                Progreso: {progresoTotal().comp} de {progresoTotal().total} preguntas · Puntos: {puntosTotales()}
            </div>
        </div>
        <button class="btn" style="background:#4338ca;color:#fff;border:none;cursor:pointer;"
                on:click={() => window.location.href = `/evaluaciones/${evaluacionId}/resultados`}>Ver resultados</button>

        {#each pilares as pilar}
            <div class="card">
                <div class="pilar-title">{pilar.nombre} <span class="badge">{pilar.preguntas.filter(q => q.completada).length}/{pilar.preguntas.length}</span></div>
                <p style="font-size:13px;color:#6b7280;margin-bottom:12px">{pilar.descripcion}</p>

                {#each pilar.preguntas as q}
                    <div class="pregunta">
                        <label style="display:flex;align-items:center;">
                            <input type="checkbox" class="checkbox" checked={q.completada} on:change={() => toggle(pilar.id, q.id)} />
                            <span>{q.texto}</span>
                            {#if q.critica}<span class="critica">Crítica</span>{/if}
                            <span class="badge">{q.puntos} pts</span>
                        </label>
                    </div>
                {/each}
            </div>
        {/each}
    {/if}
</div>
