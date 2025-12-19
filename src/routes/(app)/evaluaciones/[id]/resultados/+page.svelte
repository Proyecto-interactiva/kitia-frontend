<script lang="ts">
    import type { ResultadosData } from './+page';
    import { PilaresUrls } from '$lib/pilares';

    export let data: { dataset: ResultadosData };
    const dataset = data.dataset;
    // retrieve id from url
    const id_from_url = window.location.pathname.split('/')[2];

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
                    ? 'Contiene aspectos a revisar'
                    : 'Requiere atención ética urgente';
    }

    function getPilarUrl(nombre: string) {
        const found = PilaresUrls.find(p => p.nombre === nombre);
        return found ? found.url : "#";
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

    .page{ min-height: 100dvh; }
    .wrap{ max-width: 1100px; margin: 0 auto; padding: clamp(12px, 3.5vw, 24px); }

    h1.title{
        text-align:center; margin: 6px 0 12px;
        font-weight: 900; color: var(--ink);
        font-size: 38px;
        letter-spacing: .2px;
    }

    .status{

        border-radius: 20px;
        background: #fff;
        padding: 14px 16px;
    }
    .status-head{
        display:flex; align-items:center; justify-content:space-between; gap: 12px;
    }
    .export{
        border:0; border-radius: 999px; cursor:pointer;
        padding: 10px 16px; font-weight:800; color:#5b4705;
        /*background: linear-gradient(180deg, #f7e2a0, #f0c95c);
        box-shadow: 0 12px 24px rgba(233,191,60,.35);*/
        position: absolute;
        right: 15%;
    }

    .infocard{
        background:#fff; border-bottom: 1px solid var(--line); border-radius: 18px;
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
        background:#fff; border: 1px solid #eee; border-radius: 0;
        padding: 16px; box-shadow: None;
    }
    .h4{ font-weight: 800; margin: 0 0 10px; color:#222 }

    /* Fortalezas: fila “split” */
    .strength{
        display:grid; grid-template-columns: 1fr auto; gap: 12px;
        align-items: stretch;
        border-bottom: 1px solid #E9F7E8;
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

    .pilar-chip a:visited, .pilar-chip a {
        color: white;
        text-decoration: none;
    }

    .green{ background: #E9F7E8; padding: 10px; margin: -16px -16px 0; }

    /* Mejora: neutral */
    .improve{
        border-radius: 16px; padding: 10px; margin-bottom: 10px;
    }

    .red{ background: #F1C9B5; padding: 10px; margin: -16px -16px 0; }

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
        display:flex; justify-content:space-between; align-items:flex-start; gap: 22px;
        border-top: 1px solid var(--line); padding: 12px 0;
    }
    .purple{ background: #DCCAFF; padding: 10px; margin: -16px -16px 0; }

    .btn{ border: 1px solid #e5e7eb; border-radius: 999px; background: #fff; padding: 8px 12px; font-weight: 700; cursor:pointer; }
    .tool-row .tool-link{
        width: 10%; min-width: 80px;
        display:flex; flex-direction:column; align-items:center;
    }
    .tool-row .tool-link span{ margin-bottom:6px; text-align:center; }
    .play-mini{
        grid-column: 2 / 3; align-self:center; justify-self:center;
        width:45px; height:45px; border-radius:50%; background:#DCCAFF; display:grid; place-items:center;
    }
    .play-mini svg path{ fill: #fff }
    /* ===== Gauge de progreso (anillo grueso con pista y cap) ===== */
    .status-head{ flex-wrap:wrap; } /* por si se reduce el ancho */
    .progress-kpi{
        display:flex; align-items:center; gap:12px;
        margin: 0 auto; /* empuja hacia la derecha si hay espacio */
    }

    .gauge{
        --size: 104px;        /* tamaño del gauge */
        --thickness: 34px;    /* grosor del anillo */
        --track: #eef2f7;     /* color de pista */
        --shadow: 0 10px 26px rgba(0,0,0,.08);

        width: var(--size);
        height: var(--size);
        border-radius: 50%;
        position: relative;
        display: grid;
        place-items: center;
        box-shadow: var(--shadow);

        /* Pista + progreso */
        background:
                conic-gradient(var(--gcolor) calc(var(--value,0) * 1%), var(--track) 0) border-box;

        /* Donut (agujero) */
        -webkit-mask:
                radial-gradient(farthest-side, transparent calc(50% - var(--thickness)), #000 0);
        mask:
                radial-gradient(farthest-side, transparent calc(50% - var(--thickness)), #000 0);

        transition: background .6s ease; /* animación al actualizar */
    }
    .gauge::before{
        content:"";
        position:absolute; inset:0;
        border-radius:50%;
        box-shadow: inset 0 1px 0 rgba(255,255,255,.9);
        pointer-events:none;
    }

    /* Punto (cap) al final del trazo */
    .gauge__cap{
        position:absolute;
        width: calc(var(--thickness) + 40px);
        height: calc(var(--thickness) + 40px);
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 0 3px #fff; /* halo */
    }

    /* Número centrado */
    .gauge__num {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        font-size: 26px;
        font-weight: 500;
        color: #111;
        line-height: 1;
        text-align: center;
        margin: 0;
    }

    .kpi-caption{ display:grid; gap:2px;max-width: 40%; }
    .kpi-title{ font-weight:800; }
    .kpi-sub{ font-size:12px; }

    /* === Forzar que imprima colores y fondos como en pantalla === */
    *,
    *::before,
    *::after{
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        color-adjust: exact;
    }

    /* Página y cortes de página */
    @page{
        size: A4;
        margin: 14mm; /* ajusta si quieres más/menos margen */
    }

    @media print {
        /* Fondo blanco en papel; conserva tus colores internos */
        :root { --cream:#ffffff; }
        html, body, .page { background:#fff !important; }
        .wrap { max-width: 100%; padding: 0; }

        /* Oculta elementos interactivos que no aportan en papel */
        .export,
        .play-mini,
        .btn,
        .tool-row .tool-link { display:none !important; }

        /* Evita saltos cortando tarjetas a la mitad */
        .card,
        .status,
        .band,
        .strength,
        .improve,
        .infocard,
        .tool-row { break-inside: avoid; page-break-inside: avoid; }

        /* Mantén el layout de dos columnas si cabe */
        .grid { grid-template-columns: 1fr 1fr; gap: 12px; }

        /* Quita posiciones raras en print */
        .status-head { position: static !important; }

        /* Sombras suaves (si prefieres sin tinta extra, cámbialas por none) */
        .status,
        .card,
        .band { box-shadow: 0 0 0 1px rgba(0,0,0,.06); }

        /* Asegura bordes visibles sobre papel */
        .status{ border:1px solid #e5e7eb; border-radius: 16px; }
        .card{ border:1px solid #e5e7eb; border-radius: 12px; }
        .band{ border:1px solid #e5e7eb; border-radius: 16px; }

        /* Colores de secciones destacadas (mantiene tus bloques de color) */
        .green { background:#E9F7E8 !important; }
        .red   { background:#F1C9B5 !important; }
        .purple{ background:#DCCAFF !important; }

        /* Gauge: imprime el conic-gradient y el número centrado */
        .gauge{
            /* algunos drivers bajan saturación; esto ayuda */
            filter: contrast(1) saturate(1.05);
        }

        /* Tipografías un poco más compactas para caber mejor, opcional:
        body { font-size: 11pt; }
        h1.title { font-size: 18pt; }
        */
    }


</style>

<div class="page">
    <div class="wrap">

        <h1 class="title">Síntesis de tu revisión ética</h1>

        <section class="status" style={`border-color:${estadoColor}33`}>
            <div class="status-head">
                <!-- KPI: Gauge de progreso -->
                <div class="progress-kpi">
                    <div
                            class="gauge"
                            style={`--value:${pct(dataset.resumen.progreso)}; --gcolor:${estadoColor};`}
                            role="img"
                            aria-label={`Progreso ${pct(dataset.resumen.progreso)}%`}
                    >
                        <div class="gauge__num">{pct(dataset.resumen.progreso)}%</div>
                        <span class="gauge__cap" aria-hidden="true"></span>
                    </div>
                    <div class="kpi-caption">
                        <div class="kpi-title" style={`color:${estadoColor}`}> {labelEstado(dataset.resumen.estado)}</div>
                        <div class="kpi-sub muted">{dataset.resumen.puntos}/{dataset.resumen.puntos_max} pts</div>
                    </div>
                </div>

                <button class="export" on:click={() => window.print()}>Exportar</button>
            </div>

            <div class="infocard">
                <div style="font-weight:700">Nombre: <span class="muted" style="font-weight:600">{dataset.nombre}</span></div>
                {#if dataset.descripcion}<div class="muted">Descripción: {dataset.descripcion}</div>{/if}
                {#if dataset.etapa}<div class="muted">Etapa del proceso creativo: {dataset.etapa}</div>{/if}
                <p class="muted" style="margin:26px 0 0; font-size:13px;">
                    Este indicador no es una calificación. Resume áreas donde puedes reflexionar y fortalecer decisiones éticas en el uso de IA.
                </p>
            </div>
        </section>

        <section class="grid">
            <!-- Fortalezas -->
            <div class="card">
                <div class="h4 green">Fortalezas identificadas
                    <span class="muted" style="font-weight:600"> · {dataset.resumen.fortalezas.length}</span>
                </div>
                <p class="muted" style="margin:0 0 10px;">
                    Estos son aspectos donde tu proyecto ya muestra decisiones alineadas con una reflexión ética sobre el uso de IA.
                </p>

                {#if dataset.resumen.fortalezas.length === 0}
                    <p class="muted">Aún no hay fortalezas.</p>
                {:else}
                    {#each dataset.resumen.fortalezas as f}
                        <div class="strength">
                            <div class="left">
                                <strong>{f.texto}</strong>
                                <div class="meta-line">Puntos {f.puntos}{#if f.impact !== undefined}{/if}</div>
                            </div>
                            <div class="pilar-chip"><a href={getPilarUrl(f.pilar)} target="_blank">🔗 {f.pilar}</a></div>
                        </div>
                    {/each}
                {/if}
            </div>

            <!-- Áreas de mejora -->
            <div class="card">
                <div class="h4 red">Aspectos éticos a fortalecer
                    <span class="muted" style="font-weight:600"> · {dataset.resumen.mejoras.length}</span>
                </div>
                <p class="muted" style="margin:0 0 10px;">
                    Estos puntos no indican errores, sino oportunidades para revisar y ajustar decisiones en el uso de IA.
                </p>

                {#if dataset.resumen.mejoras.length === 0}
                    <p class="muted">No se detectaron pendientes críticos.</p>
                {:else}
                    {#each dataset.resumen.mejoras as a}
                        <div class="improve">
                            <div style="font-weight:700; margin-bottom:6px">{a.texto}</div>
                            <div class="muted" style="font-size:13px">
                                Pilar: <span style="font-weight:600">{a.pilar}</span> ·
                                Valor: {a.puntos} pts
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
        </section>


        <!-- Herramientas -->
        <section class="card" style="margin-top:16px">
            <div class="h4 purple">Herramientas recomendadas</div>
            <br>
            <p class="muted" style="margin:0 0 10px;">
                A partir de tu revisión ética, aquí encontrarás herramientas y recursos que pueden ayudarte en tu proceso.
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
                            <div class="tool-link">
                                <a class="play-mini" href={t.url} target="_blank" rel="noopener" aria-label="Abrir tutorial">
                                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                                        <path d="M8 5v14l11-7Z"/>
                                    </svg>
                                </a>
                                <span class="muted" style="font-size:12px;">Ver tutorial</span>
                            </div>


                        {/if}
                    </div>
                {/each}
            {/if}
        </section>

        <!-- volver a editar  -->
        <div style="text-align:center; margin: 24px 0;">
            <p class="muted" style="margin-bottom:32px;">
                Esta revisión no es un cierre definitivo. Puedes volver a tus respuestas, ajustar decisiones y repetir el proceso cuantas veces lo necesites a lo largo de tu proyecto.
            </p>
            <a href={`/evaluaciones/${id_from_url}/checklist`} class="btn" style="border-color: None; color: var(--ink); margin-top:38px;"
            >Volver a editar la evaluación</a>
            </div>


    </div>
</div>
