<!-- src/routes/(app)/evaluacion/nueva/+page.svelte -->
<script lang="ts">
    import { base } from '$app/paths';
    // === Estado del formulario – Sección 1 ===
    type Rol = 'periodista' | 'audiovisual' | 'publicista' | 'otro';
    type Etapa =
        | 'planificacion'
        | 'recoleccion'
        | 'redaccion'
        | 'revision'
        | 'publicacion'
        | 'post';

    let rol: Rol | null = null;
    let etapa: Etapa | null = null;
    let descripcion = '';
    let herramientas = '';
    let nombre = '';

    let sending = false; let error = '';


    function pick(val: Rol){ rol = val; }
    function pickEtapa(val: Etapa){ etapa = val; }

    async function continuar(){
        error = '';
        if(!rol || !etapa || !descripcion.trim()){
            error = 'Completa rol, etapa y una breve descripción.';
            return;
        }
        // Construye payload (ajusta endpoint si usas /logs)
        const payload = {
            rol,
            etapa,
            descripcion,
            herramientas,
            nombre: nombre || `Evaluación ${new Date().toLocaleDateString()}`
        };

        sending = true;
        try{
            const res = await fetch(`${base}/api/evaluaciones/new`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if(!res.ok) throw new Error(await res.text());
            // Redirige a sección 2 (checklist por LLM) con id de logbook/evaluación
            const created = await res.json().then((r) => window.location.href = `${base}/evaluaciones/${r._id}/checklist`);
        }catch(e:any){ error = e.message || 'Error al crear la evaluación.'; }
        finally{ sending = false; }
    }
</script>

<style>
    :root{ --bg:#f7f7fb; --ink:#111827; --muted:#6b7280; --line:#e5e7eb; --card:#fff; --brand:#111827; }
    .wrap{ min-height:100dvh; background:var(--bg); color:var(--ink); }
    .container{ max-width:960px; margin:0 auto; padding:16px; }
    .h1{ font-size:22px; font-weight:700; margin:8px 0 4px; }
    .sub{ color:var(--muted); margin:0 0 16px; }

    .grid2{ display:grid; gap:10px; grid-template-columns:1fr 1fr; }
    @media (max-width:640px){ .grid2{ grid-template-columns:1fr; } }

    .pill{ border:1px solid var(--line); border-radius:12px; padding:14px; text-align:center; cursor:pointer; background:#fff; font-weight:600; }
    .pill[aria-pressed="true"]{ outline:3px solid #e5e7ff; border-color:#a5b4fc; }

    .stage{ display:flex; gap:12px; border:1px solid var(--line); background:#fff; border-radius:16px; padding:14px; cursor:pointer; }
    .stage:hover{ border-color:#d1d5db; }
    .stage.selected{ border-color:#111827; box-shadow:0 0 0 4px rgba(17,24,39,.08); }
    .stagelabel{ font-weight:600; margin:0; }
    .stagetext{ margin:2px 0 6px; color:var(--muted); font-size:13px; }
    .tags{ display:flex; flex-wrap:wrap; gap:8px; }
    .tag{ font-size:12px; background:#f3f4f6; border:1px solid #e5e7eb; border-radius:999px; padding:4px 8px; }

    .card{ background:#fff; border:1px solid var(--line); border-radius:16px; padding:16px; }
    .label{ font-weight:600; margin-bottom:6px; }
    .input, .textarea{ width:100%; border:1px solid var(--line); border-radius:10px; padding:10px 12px; }
    .textarea{ min-height:140px; resize:vertical; }
    .muted{ color:var(--muted); font-size:13px; }

    .footer{ position:sticky; bottom:0; left:0; right:0; background:linear-gradient(180deg, rgba(247,247,251,0) 0%, rgba(247,247,251,.9) 30%, rgba(247,247,251,1) 70%); padding:12px 0; backdrop-filter:saturate(180%) blur(6px); }
    .btn{ appearance:none; border:1px solid var(--line); background:#fff; color:var(--ink); border-radius:10px; padding:12px 16px; cursor:pointer; font-weight:700; }
    .btn.primary{ background:#111827; color:#fff; border-color:#111827; }
    .error{ color:#b91c1c; margin-top:8px; }
</style>

<div class="wrap">
    <div class="container">
        <h1 class="h1">Evaluación ética inicial</h1>
        <p class="sub">Completa estos datos para crear tu bitácora y personalizar la evaluación.</p>

        <!-- Rol -->
        <section style="margin-top:16px;">
            <h3 style="margin:0 0 8px;">¿Cuál es tu rol?</h3>
            <div class="grid2">
                <button class="pill" aria-pressed={rol==='periodista'} on:click={() => pick('periodista')}>Periodista</button>
                <button class="pill" aria-pressed={rol==='audiovisual'} on:click={() => pick('audiovisual')}>Audiovisual</button>
                <button class="pill" aria-pressed={rol==='publicista'} on:click={() => pick('publicista')}>Publicista</button>
                <button class="pill" aria-pressed={rol==='otro'} on:click={() => pick('otro')}>Otro</button>
            </div>
        </section>

        <!-- Etapa del proceso -->
        <section style="margin-top:18px; display:grid; gap:12px;">
            <h3 style="margin:0 0 8px;">¿En qué etapa de tu proceso comunicacional te encuentras?</h3>

            <div class="stage {etapa==='planificacion' ? 'selected' : ''}" role="button" on:click={() => pickEtapa('planificacion')}>
                <div class="icon" aria-hidden="true" style="width:36px;height:36px;border-radius:10px;background:#e0e7ff;display:grid;place-items:center;color:#3730a3;">🔎</div>
                <div>
                    <p class="stagelabel">Planificación e Investigación Inicial</p>
                    <p class="stagetext">Definiendo el enfoque, identificando fuentes, estableciendo objetivos</p>
                    <div class="tags">
                        <span class="tag">Definición de objetivos éticos</span>
                        <span class="tag">Selección responsable de fuentes</span>
                        <span class="tag">Planificación de consentimientos</span>
                    </div>
                </div>
            </div>

            <div class="stage {etapa==='recoleccion' ? 'selected' : ''}" role="button" on:click={() => pickEtapa('recoleccion')}>
                <div class="icon" aria-hidden="true" style="width:36px;height:36px;border-radius:10px;background:#dcfce7;display:grid;place-items:center;color:#065f46;">🗣️</div>
                <div>
                    <p class="stagelabel">Recolección de Información</p>
                    <p class="stagetext">Entrevistas, trabajo de campo, recopilación de datos</p>
                    <div class="tags">
                        <span class="tag">Consentimiento informado</span>
                        <span class="tag">Protección de fuentes</span>
                        <span class="tag">Verificación de información</span>
                    </div>
                </div>
            </div>

            <div class="stage {etapa==='redaccion' ? 'selected' : ''}" role="button" on:click={() => pickEtapa('redaccion')}>
                <div class="icon" aria-hidden="true" style="width:36px;height:36px;border-radius:10px;background:#ede9fe;display:grid;place-items:center;color:#6d28d9;">✍️</div>
                <div>
                    <p class="stagelabel">Redacción y Producción</p>
                    <p class="stagetext">Escribiendo, editando, usando herramientas de IA</p>
                    <div class="tags">
                        <span class="tag">Transparencia en uso de IA</span>
                        <span class="tag">Representación equilibrada</span>
                        <span class="tag">Precisión en datos</span>
                    </div>
                </div>
            </div>

            <div class="stage {etapa==='revision' ? 'selected' : ''}" role="button" on:click={() => pickEtapa('revision')}>
                <div class="icon" aria-hidden="true" style="width:36px;height:36px;border-radius:10px;background:#ffedd5;display:grid;place-items:center;color:#c2410c;">✅</div>
                <div>
                    <p class="stagelabel">Revisión y Verificación</p>
                    <p class="stagetext">Fact-checking y validación ética</p>
                    <div class="tags">
                        <span class="tag">Verificación de hechos</span>
                        <span class="tag">Revisión de sesgos</span>
                        <span class="tag">Validación ética</span>
                    </div>
                </div>
            </div>

            <div class="stage {etapa==='publicacion' ? 'selected' : ''}" role="button" on:click={() => pickEtapa('publicacion')}>
                <div class="icon" aria-hidden="true" style="width:36px;height:36px;border-radius:10px;background:#fee2e2;display:grid;place-items:center;color:#b91c1c;">📤</div>
                <div>
                    <p class="stagelabel">Publicación y Distribución</p>
                    <p class="stagetext">Preparando para publicar y considerando impacto</p>
                    <div class="tags">
                        <span class="tag">Impacto social</span>
                        <span class="tag">Responsabilidad editorial</span>
                        <span class="tag">Consideraciones legales</span>
                    </div>
                </div>
            </div>

            <div class="stage {etapa==='post' ? 'selected' : ''}" role="button" on:click={() => pickEtapa('post')}>
                <div class="icon" aria-hidden="true" style="width:36px;height:36px;border-radius:10px;background:#e0e7ff;display:grid;place-items:center;color:#1e3a8a;">📈</div>
                <div>
                    <p class="stagelabel">Post-publicación y Seguimiento</p>
                    <p class="stagetext">Monitoreando reacciones y manejando correcciones</p>
                    <div class="tags">
                        <span class="tag">Manejo de errores</span>
                        <span class="tag">Respuesta a feedback</span>
                        <span class="tag">Análisis de impacto</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Descripción + Herramientas + Adjuntos -->
        <section style="margin-top:18px; display:grid; gap:12px;">
            <div class="card">
                <div class="label">Nombre de la evaluación (opcional)</div>
                <input class="input" bind:value={nombre} placeholder="Ej.: Reportaje sobre acceso a la justicia en zonas rurales" />
                <div class="muted" style="font-size:13px; margin-top:4px;">Si no pones nombre, se asignará uno por defecto con la fecha actual.</div>
                <div class="label">Describe brevemente lo que planeas hacer</div>
                <textarea class="textarea" bind:value={descripcion} placeholder="Ej.: Reportaje sobre acceso a la justicia en zonas rurales, con entrevistas a defensorías y expedientes públicos…"></textarea>
                <div class="label" style="margin-top:12px;">Herramientas que crees usar (IA u otras)</div>
                <input class="input" bind:value={herramientas} placeholder="Ej.: ChatGPT para resúmenes, Groq LLaMA3 para clasificar fuentes, hojas de cálculo, etc." />
            </div>
        </section>

        {#if error}
            <p class="error">{error}</p>
        {/if}

        <div class="footer">
            <div class="container" style="display:flex; gap:10px; justify-content:flex-end;">
                <button class="btn primary" disabled={sending} on:click={continuar}>Continuar con evaluación ética</button>
            </div>
        </div>
    </div>
</div>

