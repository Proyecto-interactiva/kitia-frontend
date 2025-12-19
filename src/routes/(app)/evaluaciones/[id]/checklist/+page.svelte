<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
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

    // Tips para amenizar la espera
    const tips = [
        'Verificando fuentes…',
        'Midiendo impacto y riesgos…',
        'Buscando sesgos…',
        'Revisando transparencia y trazabilidad…',
        'Organizando preguntas del pilar actual…'
    ];

    let fake = 0;          // progreso visual
    let tipIndex = 0;      // índice de tip
    let tick: any = null;  // timer

    // Arranca/para el progreso fake
    $: if (loading && !tick) {
        fake = 0;
        tipIndex = 0;
        tick = setInterval(() => {
            fake = Math.min(95, fake + Math.ceil(Math.random() * 7));
            tipIndex = (tipIndex + 1) % tips.length;
        }, 600);
    }
    $: if (!loading && tick) {
        clearInterval(tick);
        tick = null;
        fake = 100; // remate bonito
    }
    onDestroy(() => { if (tick) clearInterval(tick); });

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
        <section class="loadingWrap" aria-busy="true" aria-live="polite">
            <div class="loader">
                <div class="pill">
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                        <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="orbit"></span>
                </div>

                <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={fake}>
                    <div class="bar" style={`width:${fake}%`}></div>
                </div>

                <div class="tip"><strong>{fake}%</strong> · {tips[tipIndex]}</div>
            </div>

            <div class="skeletonList">
                {#each Array(3) as _, i}
                    <div class="skeletonCard">
                        <span class="skDot"></span>
                        <div class="skLines">
                            <span class="skLine"></span>
                            <span class="skLine short"></span>
                        </div>
                        <span class="skBadge"></span>
                    </div>
                {/each}
            </div>
        </section>
    {:else if error}
        <p class="error">{error}</p>
    {:else}
        <header class="heading">
            <h1>{'Evaluación ética inicial'}</h1>
        </header>
        <div class="card" style="max-width:980px; margin:0 auto 20px; padding:16px;">
            <h2 style="margin:0 0 6px">Nombre: {evaluacion.nombre}</h2>
            {#if evaluacion.etapa}<p style="margin:0; color:var(--muted); font-size:14px"><strong>Etapa:</strong> {evaluacion.etapa}</p>{/if}
            {#if evaluacion.descripcion}<p style="margin:0 0 6px; color:var(--muted)"><strong>Descripción:</strong>  {evaluacion.descripcion}</p>{/if}
        </div>
        <hr />
        <h1 style="text-align:center; margin: 20px auto 10px; font-size: clamp(20px,4vw,32px); max-width:980px;">
            Autoevaluación de pilares éticos
        </h1>
        <p style="text-align:center; margin:0 auto 24px; color:
            var(--muted); font-size: clamp(14px,2vw,18px); max-width:980px;">
            Para ayudarte a reflexionar sobre el uso de IA en tu proyecto, te invitamos a revisar los siguientes pilares éticos en una autoevaluación guiada que te permita identificar fortalezas, riesgos y decisiones a considerar.
        </p>
        <p class="hint" style="margin-top:8px; background: #fffbf0; padding:8px 12px; border-radius:8px; border:1px solid #f3e6bf;"
        ><b>Marca las preguntas que consideres cumplidas en tu proyecto actual. Al finalizar, podrás revisar un resumen de tu evaluación.</b> <br><br> Este proceso no evalúa tu desempeño académico ni reemplaza decisiones docentes. Es una herramienta que entrega un espacio de apoyo para la reflexión y autoevaluación ética.</p>
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
                {#if q.critica}Aspecto sensible · {/if}{q.puntos}p
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

    .card{border: None}
    .screen{  padding: clamp(14px,3vw,24px); }
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
        border-bottom:1px solid var(--line);
        border-radius:18px;
        padding: 14px 16px;
        cursor: pointer;
        transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
    }
    .q:hover{ transform: translateY(-2px); }
    .q.done{ }

    /* Checkbox accesible + estilo */
    .check{
        position:absolute;
        opacity:0;
        width:1px; height:1px;
        overflow:hidden; clip:rect(0 0 0 0);
    }
    /* Base del tick: círculo neutro */
    .tick{
        width: 30px; height: 30px; border-radius: 50%;
        display: grid; place-items: center;
        position: relative;
        background: #fff;
        border: 2px solid #d6d3ce;            /* borde neutro */
        transition: background .18s, border-color .18s, box-shadow .18s, transform .12s;
    }

    /* El ícono ✓ oculto por defecto */
    .tick svg{
        opacity: 0;
        transform: scale(.7);
        transition: opacity .12s ease, transform .12s ease;
    }

    /* ---------- Estado UNCHECKED (hint con círculos) ---------- */
    .q:not(.done) .tick{
        border: 2px dashed #d6d3ce;           /* anillo punteado */
    }

    .q:not(.done) .tick::before{
        content: "";
        position: absolute; inset: 5px;
        border: 2px dashed #e7e2d6;           /* segundo anillo interior */
        border-radius: 50%;
    }

    /* pulso suave para sugerir “clickeable”
    .q:not(.done) .tick::after{
        content: "";
        position: absolute; inset: -6px;
        border-radius: 50%;
        box-shadow: 0 0 0 0 rgba(233,191,60,.0);
        animation: pulse 1.6s ease-out infinite;
    }*/

    .q:not(.done):hover .tick{ border-color:#c7c2b8; }

    /* Respeta accesibilidad: si el usuario reduce animaciones, no pulses */
    @media (prefers-reduced-motion: reduce){
        .q:not(.done) .tick::after{ animation: none; }
    }

    @keyframes pulse{
        0%   { box-shadow: 0 0 0 0   rgba(233,191,60,.45); }
        70%  { box-shadow: 0 0 0 8px rgba(233,191,60,0); }
        100% { box-shadow: 0 0 0 0   rgba(233,191,60,0); }
    }

    /* ---------- Estado CHECKED (como lo tenías) ---------- */
    .q.done .tick{
        background: radial-gradient(circle at 30% 30%, #ffd978, var(--accent));
        box-shadow: 0 6px 12px rgba(0,0,0,.12), inset 0 1px 0 #fff;
        border: 0;                             /* sin anillo cuando está marcado */
    }
    .q.done .tick svg{ opacity: 1; transform: scale(1); }

    /* Accesibilidad al tab: deja un ring cuando el checkbox recibe foco */
    .q:focus-within{
        outline: 0;
    }


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
    /* Loader vistoso + skeletons */
    .loadingWrap{ max-width:980px; margin: 10px auto; text-align:center }
    .loader{ display:grid; gap:10px; place-items:center; margin-bottom:12px }

    .pill{
        position:relative; width:64px; height:64px; border-radius:50%;
        background: radial-gradient(circle at 30% 30%, #ffd978, var(--accent));
        color:#fff; display:grid; place-items:center;
        box-shadow: 0 14px 28px rgba(0,0,0,.18), inset 0 1px 0 #fff;
        animation: bob 1.2s ease-in-out infinite;
    }
    .pill svg{ filter: drop-shadow(0 1px 0 rgba(0,0,0,.2)); }
    .orbit{
        position:absolute; inset:-6px; border-radius:50%;
        border:3px solid rgba(255,255,255,.6); border-top-color: transparent;
        animation: spin .9s linear infinite;
    }

    .progress{
        width: min(680px, 92%); height:12px; border-radius:999px;
        background:#f3f4f6; border:1px solid #e5e7eb; overflow:hidden;
        box-shadow: inset 0 1px 0 #fff;
    }
    .bar{
        height:100%; background: linear-gradient(90deg, #b9f0cf, #37b56f);
        transition: width .35s ease;
    }

    .tip{ color:#374151; font-size:14px }
    .tip strong{ font-weight:900; color:#065f46 }

    /* Skeletons que parecen tarjetas del checklist */
    .skeletonList{ display:grid; gap:12px; margin-top:8px }
    .skeletonCard{
        display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:12px;
        background:#fff; border:1px solid var(--line); border-radius:18px; padding:12px 14px;
        box-shadow: var(--shadow); position:relative; overflow:hidden;
    }
    .skeletonCard::after{
        content:""; position:absolute; inset:0;
        background: linear-gradient(100deg, transparent 20%, rgba(255,255,255,.65) 50%, transparent 80%);
        transform: translateX(-100%); animation: shimmer 1.2s infinite;
    }
    .skDot{ width:28px; height:28px; border-radius:50%; background:#ffe08a; box-shadow: inset 0 1px 0 #fff; }
    .skLines{ display:grid; gap:8px }
    .skLine{ width:min(520px, 65vw); height:12px; border-radius:8px; background:#f0f0f0 }
    .skLine.short{ width:min(280px, 40vw) }
    .skBadge{ width:56px; height:20px; border-radius:999px; background:#eef2ff }

    @keyframes spin{ to{ transform: rotate(360deg) } }
    @keyframes bob{ 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-6px) } }
    @keyframes shimmer{ 100%{ transform: translateX(100%) } }

</style>
