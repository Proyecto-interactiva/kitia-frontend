<script lang="ts">
    import type { ResultadosData } from './+page';

    export let data: { dataset: ResultadosData };
    const dataset = data.dataset;

    function pct(n: number) {
        return Math.round(n * 100);
    }
    function colorEstado(e: ResultadosData['resumen']['estado']) {
        return e === 'excelente'
            ? '#10b981' // verde
            : e === 'ok'
                ? '#3b82f6' // azul
                : e === 'necesita_mejoras'
                    ? '#f59e0b' // ámbar
                    : '#ef4444'; // rojo
    }
    function labelEstado(e: ResultadosData['resumen']['estado']) {
        return e === 'excelente'
            ? 'Cumplimiento ético alto'
            : e === 'ok'
                ? 'Cumplimiento ético aceptable'
                : e === 'necesita_mejoras'
                    ? 'Necesita mejoras'
                    : 'Requiere atención ética urgente';
    }

    // Banda "Pilares Éticos": toma el pilar con mayor % obtenido
    const topPilar =
        dataset.pilares?.reduce(
            (best, p) => {
                const ratio = p.total ? p.obtenido / p.total : 0;
                return ratio > best.ratio ? { name: p.nombre, ratio, pts: p.obtenido, total: p.total } : best;
            },
            { name: '—', ratio: -1, pts: 0, total: 0 }
        ) ?? { name: '—', ratio: 0, pts: 0, total: 0 };

    const estadoColor = colorEstado(dataset.resumen.estado);
</script>

<style>
    :root{
        --cream:#f7efd2;
        --ink:#1f2937;
        --muted:#6b7280;

        --card:#ffffff;
        --line:#ece5d6;

        --green:#66CC66;
        --green-soft:#ebfdf5;

        --yellow:#F2C243;
        --yellow-deep:#d4a61c;

        --radius:24px;
        --shadow:0 18px 40px rgba(0,0,0,.12);
    }

    .page{ background: var(--cream); min-height: 100dvh; }
    .wrap{ max-width: 1100px; margin: 0 auto; padding: clamp(12px, 3.5vw, 24px); }

    h1.title{
        text-align:center; margin: 6px 0 12px;
        font-weight: 900; color: var(--ink);
        font-size: clamp(28px, 5vw, 56px);
        letter-spacing: .2px;
    }

    .status{
        border: 1px solid var(--line);
        border-radius: 20px;
        background: #fff;
        padding: 14px 16px;
        box-shadow: var(--shadow);
    }
    .status-head{
        display:flex; align-items:center; justify-content:space-between; gap: 12px;
    }
    .export{
        border:0; border-radius: 999px; cursor:pointer;
        padding: 10px 16px; font-weight:800; color:#5b4705;
        background: linear-gradient(180deg, #f7e2a0, #f0c95c);
        box-shadow: 0 12px 24px rgba(233,191,60,.35);
    }

    .infocard{
        background:#fff; border: 1px solid var(--line); border-radius: 18px;
        padding: 12px; margin-top: 10px;
    }
    .muted{ color: var(--muted); }
    .white{ color: var(--card); }

    .grid{
        display: grid; gap: 16px; grid-template-columns: 1fr 1fr;
        margin-top: 16px;
    }
    @media (max-width: 900px){ .grid{ grid-template-columns: 1fr; } }

    .card{
        background:#fff; border: 1px solid var(--line); border-radius: var(--radius);
        padding: 16px; box-shadow: var(--shadow);
    }
    .h4{ font-weight: 800; margin: 0 0 10px; color:#222 }

    /* Fortalezas: fila “split” */
    .strength{
        display:grid; grid-template-columns: 1fr auto; gap: 12px;
        align-items: stretch;
        background: #f8fff9; /* leve verde */
        border: 1px solid #d9fbe7;
        border-radius: 16px; padding: 10px; margin-bottom: 10px;
    }
    .strength .left strong{ display:block; margin-bottom: 6px; }
    .meta-line{ color:#0d6b44; font-size: 13px }
    .pilar-chip{
        background: var(--green);
        color:#fff; border-radius: 14px;
        padding: 10px 12px; display:grid; place-items:center;
        width: 130px;
        text-align: center;
        font-weight: 600;
        font-size: smaller;
    }

    /* Mejora: neutral */
    .improve{
        background:#fffef8;
        border: 1px solid #f3e6bf;
        border-radius: 16px; padding: 10px; margin-bottom: 10px;
    }

    /* Banda amarilla “Pilares Éticos” */
    .band{
        margin-top: 18px; background: var(--yellow);
        border-radius: 22px; color:#3b2f06; box-shadow: var(--shadow);
        padding: 14px 18px; display:grid;
    }
    .band small{ display:block; opacity:.9; }
    .band .pts{ font-weight: 900; }

    /* Herramientas */
    .tool-row{
        display:flex; justify-content:space-between; align-items:flex-start; gap: 12px;
        border-top: 1px solid var(--line); padding: 12px 0;
    }
    .btn{ border: 1px solid #e5e7eb; border-radius: 999px; background: #fff; padding: 8px 12px; font-weight: 700; cursor:pointer; }
    .play-mini{
        grid-column: 2 / 3; align-self:end; justify-self:end;
        width:42px; height:42px; border-radius:50%; background:#F2C243; display:grid; place-items:center;
        box-shadow: 0 8px 18px rgba(0,0,0,.15); text-decoration:none;
    }
    .play-mini svg path{ fill: #fff }
</style>

<div class="page">
    <div class="wrap">

        <h1 class="title">Resultados del Análisis Ético</h1>

        <section class="status" style={`border-color:${estadoColor}33`}>
            <div class="status-head">
                <div>
                    <div style="font-weight:900;font-size:20px;color:{estadoColor}">
                        {labelEstado(dataset.resumen.estado)}
                    </div>
                    <div class="muted">
                        Puntuación: {dataset.resumen.puntos}/{dataset.resumen.puntos_max}
                        · Progreso {pct(dataset.resumen.progreso)}%
                    </div>
                </div>
                <button class="export" on:click={() => window.print()}>Exportar</button>
            </div>

            <div class="infocard">
                <div style="font-weight:700">Nombre: <span class="muted" style="font-weight:600">{dataset.nombre}</span></div>
                {#if dataset.descripcion}<div class="muted">Descripción: {dataset.descripcion}</div>{/if}
                {#if dataset.etapa}<div class="muted">Etapa: {dataset.etapa}</div>{/if}
            </div>
        </section>

        <section class="grid">
            <!-- Fortalezas -->
            <div class="card">
                <div class="h4">Fortalezas identificadas
                    <span class="muted" style="font-weight:600"> · {dataset.resumen.fortalezas.length}</span>
                </div>

                {#if dataset.resumen.fortalezas.length === 0}
                    <p class="muted">Aún no hay fortalezas.</p>
                {:else}
                    {#each dataset.resumen.fortalezas as f}
                        <div class="strength">
                            <div class="left">
                                <strong>{f.texto}</strong>
                                <div class="meta-line">Puntos {f.puntos}{#if f.impact !== undefined} · Impacto: {Math.round(f.impact)}%{/if}</div>
                            </div>
                            <div class="pilar-chip">{f.pilar}</div>
                        </div>
                    {/each}
                {/if}
            </div>

            <!-- Áreas de mejora -->
            <div class="card">
                <div class="h4">Áreas de mejora
                    <span class="muted" style="font-weight:600"> · {dataset.resumen.mejoras.length}</span>
                </div>

                {#if dataset.resumen.mejoras.length === 0}
                    <p class="muted">No se detectaron pendientes críticos.</p>
                {:else}
                    {#each dataset.resumen.mejoras as a}
                        <div class="improve">
                            <div style="font-weight:700; margin-bottom:6px">{a.texto}</div>
                            <div class="muted" style="font-size:13px">
                                Pilar: <span style="font-weight:600">{a.pilar}</span> ·
                                Prioridad: {Math.round(a.prioridad)}% ·
                                Esfuerzo: {Math.round(a.esfuerzo)}% ·
                                Valor: {a.puntos} pts
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
        </section>

        <!-- Tabla simple de pilares -->
        <section class="band" style="margin-top:16px">
            <div style="font-weight:900; font-size: 20px; margin-bottom: 10px">Detalle de Principios Éticos</div>
            {#each dataset.pilares as p}
                <div style="display:flex; justify-content:space-between; border-top:1px solid var(--line); padding:10px 0">
                    <div>{p.nombre}</div>
                    <div class="white">{p.obtenido}/{p.total} pts</div>
                </div>
            {/each}
        </section>

        <!-- Herramientas -->
        <section class="card" style="margin-top:16px">
            <div class="h4">Herramientas de IA recomendadas</div>
            <p class="muted" style="margin:0 0 10px;">
                Revisa tutoriales y recursos que están asociados a la situación de tu proyecto y aprende cómo aplicar buenas prácticas éticas con IA.
            </p>
            {#if dataset.herramientas.length === 0}
                <p class="muted">Aún no hay recomendaciones.</p>
            {:else}
                {#each dataset.herramientas as t}
                    <div class="tool-row">
                        <div>
                            <div style="font-weight:700">{t.name}</div>
                            {#if t.summary}<div class="muted">{t.summary}</div>{/if}
                            {#if t.bullets?.length}
                                <ul style="margin:6px 0 0 18px;color:#374151">
                                    {#each t.bullets as b}<li>{b}</li>{/each}
                                </ul>
                            {/if}
                        </div>
                        {#if t.url}
                            <a class="play-mini" href={t.url} target="_blank" rel="noopener" aria-label="Abrir tutorial">
                                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                                    <path d="M8 5v14l11-7Z"/>
                                </svg>
                            </a>
                        {/if}
                    </div>
                {/each}
            {/if}
        </section>

    </div>
</div>
