<!-- src/routes/(app)/inicio/+page.svelte -->
<script lang="ts">
    import { base } from '$app/paths';
    // Estado de selección
    let choice: 'new' | 'history' | null = null;

    // Navegación (ajusta rutas reales)
    function goBack(){ history.back(); }
    function start(){
        if (choice === 'new') {
            window.location.href = `${base}/evaluaciones/nueva`;
        } else if (choice === 'history') {
            window.location.href = `${base}/evaluaciones`;
        }
    }

    // Accesibilidad: activa con Enter/Espacio
    function selectAndFocus(val: 'new'|'history', e: KeyboardEvent){
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            choice = val;
        }
    }
</script>

<style>
    :root{ --bg:#f7f7fb; --ink:#111827; --muted:#6b7280; --line:#e5e7eb; --card:#fff; --brand:#111827; --brand-weak:#6b7280; }
    .wrap{ min-height:100dvh; display:grid; grid-template-rows:auto 1fr auto; background:var(--bg); color:var(--ink); }
    .container{ max-width:680px; margin:0 auto; padding:16px; }
    .panel{ background:var(--card); border:1px solid var(--line); border-radius:18px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,.03); }
    .title{ margin:8px 0 4px; font-size:18px; font-weight:600; text-align:center; }
    .subtitle{ margin:0 0 12px; color:var(--muted); text-align:center; }
    .choice{ display:flex; gap:12px; align-items:center; border:1px solid var(--line); border-radius:14px; padding:12px; cursor:pointer; background:#fff; transition:all .15s ease; }
    .choice:hover{ border-color:#d1d5db; transform:translateY(-1px); }
    .choice[aria-checked="true"]{ border-color:#c7d2fe; box-shadow:0 0 0 4px #eef2ff; }
    .icon{ width:36px; height:36px; border-radius:10px; display:grid; place-items:center; }
    .icon.green{ background:#d1fae5; color:#065f46; }
    .icon.blue{ background:#e0e7ff; color:#3730a3; }
    .choice h3{ margin:0; font-size:16px; font-weight:600; }
    .choice p{ margin:2px 0 0; color:var(--muted); font-size:13px; }
    .stack{ display:grid; gap:12px; margin-block:16px; }
    .footer{ display:flex; justify-content:space-between; align-items:center; gap:12px; }
    .btn{ appearance:none; border:1px solid var(--line); background:#fff; color:var(--ink); border-radius:10px; padding:10px 14px; cursor:pointer; font-weight:600; }
    .btn.primary{ background:var(--brand); color:#fff; border-color:var(--brand); opacity:1; }
    .btn.primary[disabled]{ opacity:.5; cursor:not-allowed; }
    .dots{ display:flex; gap:6px; align-items:center; justify-content:center; margin-top:8px; }
    .dot{ width:8px; height:8px; border-radius:999px; background:#d1d5db; }
    .dot.active{ background:#111827; }
    /* Mobile-safe tap target */
    @media (max-width: 480px){
        .choice{ padding:14px; }
        .choice h3{ font-size:16px; }
        .choice p{ font-size:12px; }
        .footer{ position:sticky; bottom:0; background:linear-gradient(180deg, rgba(247,247,251,0) 0%, rgba(247,247,251,0.9) 30%, rgba(247,247,251,1) 60%); padding-top:12px; }
    }
</style>

<div class="wrap">
    <div class="container" style="padding-top:20px;">
        <div class="panel" role="group" aria-labelledby="start-title">
            <div style="display:grid; place-items:center; margin-bottom:10px;">
                <!-- Ícono de documento circular -->
                <div style="width:56px;height:56px;border-radius:50%;background:#eef2ff;display:grid;place-items:center;color:#4f46e5;">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <path d="M14 2v6h6"/>
                    </svg>
                </div>
            </div>
            <h2 id="start-title" class="title">¿Cómo quieres empezar?</h2>
            <p class="subtitle">Elige la opción que mejor se adapte a tu situación actual</p>

            <div class="stack">
                <!-- Opción: nueva evaluación ética -->
                <div
                        class="choice"
                        role="radio"
                        tabindex="0"
                        aria-checked={choice === 'new'}
                        on:click={() => (choice = 'new')}
                        on:keydown={(e) => selectAndFocus('new', e)}
                >
                    <div class="icon green" aria-hidden="true">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M7 20c7 0 10-6 10-10V5l-5 5"/>
                            <path d="M2 15s3 3 7 3"/>
                        </svg>
                    </div>
                    <div>
                        <h3>Empezar nueva evaluación ética</h3>
                        <p>Comienza una evaluación ética desde cero sobre tu proceso comunicacional</p>
                    </div>
                </div>

                <!-- Opción: ver evaluaciones anteriores -->
                <div
                        class="choice"
                        role="radio"
                        tabindex="0"
                        aria-checked={choice === 'history'}
                        on:click={() => (choice = 'history')}
                        on:keydown={(e) => selectAndFocus('history', e)}
                >
                    <div class="icon blue" aria-hidden="true">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="18" height="14" rx="2"/>
                            <path d="M3 11h18"/>
                            <path d="M7 15h1"/>
                            <path d="M11 15h1"/>
                            <path d="M15 15h1"/>
                        </svg>
                    </div>
                    <div>
                        <h3>Ver evaluaciones anteriores</h3>
                        <p>Accede a tus evaluaciones éticas previas y continúa tu progreso</p>
                    </div>
                </div>
            </div>

            <div class="dots" aria-hidden="true">
                <span class="dot"></span>
                <span class="dot active"></span>
            </div>

            <div class="footer">
                <button type="button" class="btn" on:click={goBack} aria-label="Volver">← Atrás</button>
                <button type="button" class="btn primary" disabled={!choice} on:click={start} aria-label="Empezar">
                    ¡Empezar! →
                </button>
            </div>
        </div>
    </div>
</div>
