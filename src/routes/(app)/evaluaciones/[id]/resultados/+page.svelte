<script lang="ts">
    import type { ResultadosData } from './+page';

    // SIEMPRE llega una única prop llamada `data`
    export let data: { dataset: ResultadosData };

    // Desestructura para trabajar cómodo
    const dataset = data.dataset;

    function pct(n: number) { return Math.round(n * 100); }
    function colorEstado(e: ResultadosData['resumen']['estado']) {
        return e === 'excelente' ? '#10b981'
            : e === 'ok' ? '#3b82f6'
                : e === 'necesita_mejoras' ? '#f59e0b'
                    : '#ef4444';
    }
</script>

<style>
    .wrap { max-width: 1100px; margin: 0 auto; padding: 16px; }
    .btn { border: 1px solid #e5e7eb; border-radius: 10px; background: #fff;
        padding: 10px 12px; font-weight: 600; cursor: pointer; }
    .banner { border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; margin: 12px 0;
        background: linear-gradient(180deg, #fff, #fff 60%, rgba(0,0,0,.02)); }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 860px) { .grid { grid-template-columns: 1fr; } }
    .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; }
    .item { border: 1px solid #fee2e2; background: #fff7ed; border-radius: 12px; padding: 12px; margin-bottom: 10px; }
    .good { border-color: #dcfce7; background: #f0fdf4; }
    .row { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
    .pill { font-size: 12px; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 999px; padding: 2px 8px; }
    .muted { color: #6b7280; }
    .h4 { font-weight: 600; margin: 0 0 6px; }
    .table-row { display: flex; justify-content: space-between; border-top: 1px solid #e5e7eb; padding: 10px 0; }
</style>

<div class="wrap">
    <h1 style="margin: 8px 0 0;">Resultados del Análisis Ético</h1>

    <div class="banner" style={`border-color:${colorEstado(dataset.resumen.estado)}33`}>
        <div class="row">
            <div>
                <div style="font-weight:700;font-size:18px;color:{colorEstado(dataset.resumen.estado)}">
                    {dataset.resumen.estado === 'excelente' ? 'Cumplimiento ético alto'
                        : dataset.resumen.estado === 'ok' ? 'Cumplimiento ético aceptable'
                            : dataset.resumen.estado === 'necesita_mejoras' ? 'Necesita mejoras'
                                : 'Requiere atención ética urgente'}
                </div>
                <div class="muted">
                    Puntuación: {dataset.resumen.puntos}/{dataset.resumen.puntos_max}
                    · Progreso {pct(dataset.resumen.progreso)}%
                </div>
            </div>
            <div style="display:flex; gap:8px;">
                <button class="btn" on:click={() => window.print()}>🖨️ Exportar</button>
            </div>
        </div>
    </div>

    <div class="grid">
        <div class="card">
            <div class="h4">Fortalezas identificadas <span class="pill">{dataset.resumen.fortalezas.length} elementos</span></div>
            {#if dataset.resumen.fortalezas.length === 0}
                <p class="muted">Aún no hay fortalezas.</p>
            {:else}
                {#each dataset.resumen.fortalezas as f}
                    <div class="item good">
                        <div class="row"><strong>{f.texto}</strong><span class="pill">{f.pilar}</span></div>
                        <div class="muted" style="font-size:13px">
                            Puntos: {f.puntos}{#if f.impact !== undefined} · Impacto: {f.impact}%{/if}
                        </div>
                    </div>
                {/each}
            {/if}
        </div>

        <div class="card">
            <div class="h4">Áreas de mejora <span class="pill">{dataset.resumen.mejoras.length} elementos</span></div>
            {#if dataset.resumen.mejoras.length === 0}
                <p class="muted">No se detectaron pendientes críticos.</p>
            {:else}
                {#each dataset.resumen.mejoras as a}
                    <div class="item">
                        <div class="row"><strong>{a.texto}</strong><span class="pill">{a.pilar}</span></div>
                        <div class="muted" style="font-size:13px">
                            Prioridad: {Math.round(a.prioridad)}% · Esfuerzo: {Math.round(a.esfuerzo)}% · Valor: {a.puntos} pts
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>

    <div class="card" style="margin-top:16px">
        <div class="h4">Pilares éticos</div>
        {#each dataset.pilares as p}
            <div class="table-row">
                <div><strong>{p.nombre}</strong></div>
                <div class="muted">{p.obtenido}/{p.total} pts</div>
            </div>
        {/each}
    </div>

    <div class="card" style="margin-top:16px">
        <div class="h4">Herramientas IA recomendadas</div>
        {#if dataset.herramientas.length === 0}
            <p class="muted">Aún no hay recomendaciones.</p>
        {:else}
            {#each dataset.herramientas as t}
                <div class="row" style="align-items:start;border-top:1px solid #e5e7eb;padding:12px 0">
                    <div>
                        <div style="font-weight:600">{t.name}</div>
                        <div class="muted">{t.summary}</div>
                        {#if t.bullets?.length}
                            <ul style="margin:6px 0 0 18px;color:#4b5563">
                                {#each t.bullets as b}<li>{b}</li>{/each}
                            </ul>
                        {/if}
                    </div>
                    {#if t.url}
                        <a class="btn" href={t.url} target="_blank" rel="noopener">Tutorial</a>
                    {/if}
                </div>
            {/each}
        {/if}
    </div>
</div>
