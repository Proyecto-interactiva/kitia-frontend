<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { base } from '$app/paths';
    import { API_BASE } from '$lib/config';

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
    type Evaluacion = {
        nombre: string;
        descripcion: string;
        etapa?: string;
        pilares: Pilar[];
    };

    let evaluacion: Evaluacion = { nombre: '', descripcion: '', pilares: [] };
    let pilares: Pilar[] = [];
    let loading = true;
    let error = '';

    $: evaluacionId = $page.params.id;

    let progreso = { comp: 0, total: 0 };
    let puntos = 0;

    $: {
        const todas = pilares.flatMap(p => p.preguntas);
        progreso = { comp: todas.filter(q => q.completada).length, total: todas.length };
        puntos = todas.reduce((acc, q) => acc + (q.completada ? q.puntos : 0), 0);
    }


    onMount(async () => {
        try {
            const res = await fetch(`${API_BASE}/evaluaciones/${evaluacionId}/checklist`);
            if (!res.ok) throw new Error(await res.text());
            evaluacion = await res.json();
            pilares = evaluacion.pilares ?? [];
        } catch (e: any) {
            error = e.message;
        } finally {
            loading = false;
        }
    });

    function setChecked(pilarId: string, preguntaId: string, checked: boolean) {
        const pilar = pilares.find((p) => p.id === pilarId);
        if (!pilar) return;
        const q = pilar.preguntas.find((q) => q.id === preguntaId);
        if (!q) return;

        q.completada = checked;
        fetch(`${API_BASE}/evaluaciones/${evaluacionId}/preguntas/${preguntaId}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ completada: checked, notas: q.notas ?? '' })
        })
            .then((res) => {
                if (!res.ok) throw new Error('Error actualizando pregunta');
                else {
                    pilares = [...pilares];
                }
            })
            .catch(() => {});
    }

    function progresoTotal() {
        const todas = pilares.flatMap((p) => p.preguntas);
        const comp = todas.filter((q) => q.completada).length;
        return { comp, total: todas.length };
    }
    function puntosTotales() {
        return pilares.flatMap((p) => p.preguntas).reduce((acc, q) => acc + (q.completada ? q.puntos : 0), 0);
    }

    function goBack() {
        history.back();
    }
    function goResultados() {
        window.location.href = `${base}/evaluaciones/${evaluacionId}/resultados`;
    }
</script>

<section class="screen">
    {#if loading}
        <div class="loading">Cargando checklist…</div>
    {:else if error}
        <p class="error">{error}</p>
    {:else}
        <header class="heading">
            <h1>{'Evaluación ética inicial'}</h1>
        </header>
        <div class="card" style="max-width:980px; margin:0 auto 20px; padding:16px;">
            <h2 style="margin:0 0 6px">{evaluacion.nombre}</h2>
            {#if evaluacion.etapa}<p style="margin:0; color:var(--muted); font-size:14px"><strong>Etapa:</strong> {evaluacion.etapa}</p>{/if}
            {#if evaluacion.descripcion}<p style="margin:0 0 6px; color:var(--muted)"><strong>Descripción:</strong>  {evaluacion.descripcion}</p>{/if}
        </div>
        <hr />
        <h1 style="text-align:center; margin: 20px auto 10px; font-size: clamp(20px,4vw,32px); max-width:980px;">
            Checklist de Principios
        </h1>
        <p style="text-align:center; margin:0 auto 24px; color:
            var(--muted); font-size: clamp(14px,2vw,18px); max-width:980px;">
            Marca las acciones que ya has abordado en tu proyecto.
        </p>
        {#each pilares as p}
            <section class="pilar">
                <h2 class="pilar-title">{p.nombre}</h2>
                {#if p.descripcion}<p class="pilar-desc">{p.descripcion}</p>{/if}

                <div class="list">
                    {#each p.preguntas as q}
                        <!-- Tarjeta con checkbox real -->
                        <label class="q {q.completada ? 'done' : ''}">
                            <input
                                    class="check"
                                    type="checkbox"
                                    checked={q.completada}
                                    on:change={(e) => setChecked(p.id, q.id, (e.currentTarget as HTMLInputElement).checked)}
                            />
                            <span class="tick" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>

                            <span class="qtext">{q.texto}</span>
                            <span class="meta">
                {#if q.critica}Crítica · {/if}{q.puntos}p
              </span>
                        </label>
                    {/each}
                </div>
            </section>
        {/each}

        <div class="summary">
            Progreso: {progreso.comp}/{progreso.total} · Puntos: {puntos}
        </div>

        <nav class="actions">
            <button class="back" type="button" on:click={goBack} aria-label="Volver">
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
            <button class="cta" type="button" on:click={goResultados}>Continuar</button>
        </nav>
    {/if}
</section>

<style>
    :root{
        --cream:#f7efd2;
        --ink:#2b2b2b;
        --muted:#6b7280;
        --card:#ffffff;
        --line:#ece5d6;
        --accent:#e9bf3c;      /* amarillo */
        --accent-soft:#fff4cf; /* fondo del tick */
        --shadow:0 14px 28px rgba(0,0,0,.12);
        --ring:0 0 0 6px rgba(233,191,60,.18);
        --radius:22px;
    }

    .screen{ background:var(--cream); padding: clamp(14px,3vw,24px); }
    .heading{ text-align:center; margin: 8px auto 20px; max-width:980px; }
    .heading h1{ font-weight:800; color:var(--ink); font-size: clamp(26px,4.8vw,48px); margin:0 0 10px }
    .subtitle{ color:var(--ink); opacity:.85; margin:0; font-size: clamp(14px,2vw,18px) }

    .pilar{ max-width:980px; margin: 18px auto 26px; }
    .pilar-title{ font-size: clamp(18px,2.6vw,24px); font-weight:800; margin: 4px 0 6px; color:#3a3a3a }
    .pilar-desc{ color: var(--muted); margin: 0 0 12px }

    .list{ display:grid; gap:16px; }
    /* Tarjeta */
    .q{
        display:grid;
        grid-template-columns: auto 1fr auto;
        align-items:center; gap:14px;
        background: var(--card);
        border:1px solid var(--line);
        border-radius:18px;
        padding: 14px 16px;
        box-shadow: var(--shadow);
        cursor: pointer;
        transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
    }
    .q:hover{ transform: translateY(-2px); }
    .q.done{ border-color:#e6d48f; box-shadow: var(--shadow), var(--ring); }

    /* Checkbox accesible + estilo */
    .check{
        position:absolute;
        opacity:0;
        width:1px; height:1px;
        overflow:hidden; clip:rect(0 0 0 0);
    }
    .tick{
        width: 30px; height: 30px; border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #ffd978, var(--accent));
        color: #fff; display:grid; place-items:center;
        box-shadow: 0 6px 12px rgba(0,0,0,.12), inset 0 1px 0 #fff;
    }
    .tick svg{ opacity:0; transform: scale(.7); transition: opacity .12s ease, transform .12s ease; }

    /* cuando está marcado, muestra ✓ */
    .q.done .tick svg{ opacity:1; transform: scale(1); }

    .qtext{ color:var(--ink); font-size: clamp(14px,1.9vw,16px); line-height:1.45 }
    .meta{ color:var(--muted); font-size:12px; white-space:nowrap; margin-left:10px }

    .summary{
        max-width:980px; margin: 14px auto 0;
        text-align:center; color:var(--muted); font-size:13px;
    }

    .actions{
        max-width:980px; margin: 22px auto 0;
        display:grid; grid-template-columns: auto 1fr auto; align-items:center; gap:12px;
    }
    .back{
        width: 44px; height: 44px; border-radius:999px; border:0; background:#fff; color:#d39f1f;
        box-shadow: var(--shadow); display:grid; place-items:center; cursor:pointer;
    }
    .cta{
        padding: 12px 22px; border-radius: 999px; border:0;
        background: linear-gradient(180deg, #f7e2a0, #f0c95c); color:#5b4705; font-weight:800;
        box-shadow: 0 12px 24px rgba(233,191,60,.35); cursor:pointer;
        justify-self:end;
    }

    .loading{ text-align:center; padding:24px; color:var(--muted) }
    .error{ color:#b91c1c; text-align:center }
</style>
