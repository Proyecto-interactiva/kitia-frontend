<script lang="ts">
    import { onMount } from 'svelte';
    import { base } from '$app/paths';
    import { API_BASE } from '$lib/config';

    type Role = 'user' | 'assistant';
    type Msg = { role: Role; content: string; ts: number; id?: string };
    type Etapa = 'creacion' | 'revision' | 'publicacion' | 'post' | 'monitoreo';

    let draftId: string | null = null;
    let nombre = '';
    let input = '';
    let messages: Msg[] = [];
    let sending = false;
    let error = '';

    // meta del backend
    let etapa: Etapa | null = null;
    let descripcion = '';
    let herramientas = '';
    let ready = false;

    const minInfoOK = () => Boolean(etapa && (descripcion?.trim().length ?? 0) >= 20);

    function push(role: Role, content: string){
        messages = [...messages, { role, content, ts: Date.now() }];
        queueMicrotask(() => {
            const box = document.getElementById('chatbox');
            if (box) box.scrollTop = box.scrollHeight;
        });
    }

    onMount(async () => {
        try{
            const token = localStorage.getItem('access_token') || '';
            const res = await fetch(`${API_BASE}/intake/new_chat`, {
                method: 'POST',
                headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({}),
            });
            if(!res.ok) throw new Error(await res.text());
            const data = await res.json();
            draftId = data.draft_id;
            nombre = data.default_name || `Evaluación ${new Date().toLocaleDateString()}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
            push('assistant', '👋 Hola, soy tu Tutor IA. Cuéntame brevemente tu objetivo y en qué etapa del proyecto te encuentras.\n\nPara orientarte mejor, estas son las etapas que suelo manejar:\n\t - Creación de Contenidos \n\t - Revisión y Validación \n\t - Publicación y Difusión \n\t -Posproducción \n\t -Monitoreo.\n\n Te haré algunas preguntas y cuando creas que está todo lo que necesitas compartir puedes hacer clic en "Continuar con evaluación ética". ¡Empecemos!');
        }catch(e:any){
            error = e?.message || 'No se pudo iniciar el chat.';
        }
    });

    async function typewriter(text: string, targetIndex: number, delay = 12) {
        if (messages[targetIndex]?.role !== 'assistant') {
            messages = [...messages, { role: 'assistant', content: '', ts: Date.now() }];
            targetIndex = messages.length - 1;
        }
        for (let i = 0; i < text.length; i++) {
            messages[targetIndex].content += text[i];
            messages = [...messages];
            // Scroll chatbox to bottom after each character
            queueMicrotask(() => {
                const box = document.getElementById('chatbox');
                if (box) box.scrollTop = box.scrollHeight;
            });
            await new Promise(r => setTimeout(r, delay));
        }
    }

    async function send(){
        const text = input.trim();
        if(!text || !draftId) return;
        error = '';
        messages = [...messages, { role:'user', content:text, ts:Date.now() }];
        input = '';
        queueMicrotask(() => {
            const box = document.getElementById('chatbox');
            if (box) box.scrollTop = box.scrollHeight;
        });

        try{
            sending = true;
            const token = localStorage.getItem('access_token') || '';
            const res = await fetch(`${API_BASE}/intake/${draftId}/message`, {
                method: 'POST',
                headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ message: text, current_name: nombre || null })
            });
            if(!res.ok) throw new Error(await res.text());
            const data = await res.json();

            await typewriter(data.reply, messages.length);

            const meta = data.extracted || {};
            if (meta.etapa) etapa = meta.etapa;
            if (meta.descripcion) descripcion = meta.descripcion;
            if (meta.herramientas) herramientas = meta.herramientas;
            if (typeof data.ready === 'boolean') ready = data.ready;

        }catch(e:any){
            error = e?.message || 'Error al enviar el mensaje.';
        }finally{
            sending = false;
        }
    }

    async function continuar(){
        if(!minInfoOK()){
            error = 'Necesito al menos la etapa y una descripción breve (≥ 20 chars).';
            return;
        }
        const payload = {
            etapa,
            descripcion: descripcion.trim(),
            herramientas: herramientas.trim(),
            nombre: (nombre && nombre.trim()) ? nombre.trim() : `Evaluación ${new Date().toLocaleDateString()}`,
            draft_id: draftId
        };
        try{
            const token = localStorage.getItem('access_token') || '';
            const res = await fetch(`${API_BASE}/evaluaciones/new`, {
                method: 'POST',
                headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(payload)
            });
            if(!res.ok) throw new Error(await res.text());
            const created = await res.json();
            window.location.href = `${base}/evaluaciones/${created._id}/checklist`;
        }catch(e:any){
            error = e?.message || 'Error al crear la evaluación.';
        }
    }

    // --- Popup "100% alcanzado" (mostrar una sola vez por draft) ---
    let showCongrats = false;
    let hasShownOnce = false;

    const POPUP_KEY = (id: string | null) => `ethics_ready_popup_${id ?? 'new'}`;

    // Cargar bandera desde localStorage
    $: if (draftId && !hasShownOnce) {
        hasShownOnce = localStorage.getItem(POPUP_KEY(draftId)) === '1';
    }

    // ABRIR solo una vez: en el mismo momento que lo abrimos, marcamos como visto
    $: if ((ready || minInfoOK()) && draftId && !hasShownOnce && !showCongrats) {
        showCongrats = true;
        hasShownOnce = true;                                   // <<< clave
        localStorage.setItem(POPUP_KEY(draftId), '1');
    }

    // Bloquear scroll cuando el modal está visible
    $: {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = showCongrats ? 'hidden' : '';
        }
    }

    // Cerrar
    function closeCongrats() {
        showCongrats = false;
        hasShownOnce = true;                                   // <<< evita reabrir
        if (draftId) localStorage.setItem(POPUP_KEY(draftId), '1');
    }

    async function goToResults() {
        await continuar();
        closeCongrats();
    }

    // (Opcional) cerrar con ESC
    if (typeof window !== 'undefined') {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && showCongrats) closeCongrats();
        });
    }


</script>

<style>
    :root{
        --cream:#f7efd2;
        --ink:#1f2937;
        --muted:#6b7280;
        --card:#ffffff;
        --line:#ece5d6;

        --yellow:#e9bf3c;
        --green:#37b56f;

        --shadow:0 18px 40px rgba(0,0,0,.12);
        --shadow-sm:0 10px 20px rgba(0,0,0,.08);
        --radius:22px;
    }

    .page{ min-height:100dvh; color:var(--ink); }
    .container{ max-width:1100px; margin:0 auto; padding: clamp(12px,3.6vw,26px); display:grid; gap:14px; }

    /* Hero */
    .hero{
        background:#fff;
        padding: 18px;
        display:flex; justify-content:space-between; align-items:center; gap:12px;
    }
    .hero h1{ margin:0; font-weight:900; font-size: clamp(22px,4.2vw,36px) }
    .hero p{ margin:0; color: var(--muted) }

    /* Cards base */
    .card{
        background:#fff; border:1px solid var(--line); border-radius: 18px;
    }
    .pad{ padding: 14px;border: 0; }

    /* Grid principal: chat + meta */
    .layout{
        display:grid; gap: 16px; grid-template-columns: 1.2fr .8fr;
    }
    @media (max-width: 980px){ .layout{ grid-template-columns: 1fr; } }

    /* Nombre */
    .label{ font-weight:800; margin-bottom:6px; }
    .input{
        width:100%; border:1px solid var(--line); border-radius: 12px; padding: 10px 12px;
        background:#fff; outline:none;
    }
    .hint{ font-size: 13px; color: var(--muted); }

    /* Chat */
    .chat{ display:flex; flex-direction:column; min-height:60vh; }
    .chathead{
        padding: 12px 14px; border-bottom:1px solid var(--line);
        display:flex; gap:10px; align-items:center; font-weight:800;
        background: linear-gradient(180deg, #fff7d6, #fff);
        border-top-left-radius: 18px; border-top-right-radius: 18px;
    }
    .chatbody{ padding:14px; overflow:auto; max-height:55vh; min-height:40vh; }
    .msg{
        max-width:78%; margin:10px 0; padding:12px 14px; border-radius: 16px;
        line-height:1.45; white-space:pre-wrap; box-shadow: var(--shadow-sm);
    }
    .assistant{ background:#fff; border:1px solid var(--line); color:#1f2937; border-top-left-radius:6px; }
    .user{ background:#111827; color:#fff; margin-left:auto; border-top-right-radius:6px; }

    .composer{
        display:flex; gap:10px; padding:12px; border-top:1px solid var(--line);
        background:linear-gradient(180deg, rgba(255,255,255,0.6), #fff);
        border-bottom-left-radius: 18px; border-bottom-right-radius: 18px;
    }
    .textarea{
        flex:1; border:1px solid var(--line); border-radius: 12px; padding: 10px 12px;
        resize:none; height:48px; outline:none; background:#fff;
    }
    .btn{
        appearance:none; border:1px solid var(--line); background:#fff; color:#374151;
        border-radius: 10px; padding: 12px 16px; cursor:pointer; font-weight:800;
        box-shadow: var(--shadow-sm);
    }
    .btn:hover{  var(--ring); background: #fef3c7;}
    .btn.primary{
        border:0; color:#5b4705;
        background: linear-gradient(180deg, #f7e2a0, #f0c95c);
        box-shadow: 0 12px 24px rgba(233,191,60,.35);
    }
    .btn.primary:disabled{
        background:#f3f4f6; color:#9ca3af; box-shadow:none; cursor:not-allowed;
    }

    /* Meta panel */
    .panel{ display:grid; gap: 12px; }
    .pill{
        display:inline-flex; align-items:center; justify-content:center;
        padding: 8px 12px; border-radius: 999px; font-weight:800;
        background:#fff; border:1px solid var(--line); box-shadow: var(--shadow-sm);
    }
    .pill.green{ background: #ebfdf5; color:#065f46; border-color:#ccf5e7; }
    .pill.yellow{ background: #fff7d6; color:#6a5408; border-color:#f3e6bf; }

    .meta-block{ padding: 12px; border-top: 1px solid #f1f1f1; }
    .meta-block h4{ margin:0 0 6px; font-size:14px; font-weight:900; color:#374151 }
    .meta-text{ margin:0; color:#374151 }
    .meta-empty{ color:var(--muted); font-style:italic }

    /* Footer */
    .footer{
        display:flex; justify-content:space-between; align-items:center; gap:12px;
        padding: 12px 0;
    }
    .error{ color:#b91c1c; font-weight:700 }

    /* ===== Popup "100% alcanzado" ===== */
    .modal-overlay{
        position: fixed; inset: 0;
        background: rgba(0,0,0,.45);
        display: grid; place-items: center;
        z-index: 9999;
    }
    .modal-card{
        width: min(560px, 92vw);
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 18px 40px rgba(0,0,0,.18);
        padding: 18px 20px;
        position: relative;
    }
    .modal-head{
        display:flex; align-items:center; gap:12px; margin-bottom:8px;
    }
    .modal-icon{
        width:42px; height:42px; border-radius:10px;
        background:#fff3c4; display:grid; place-items:center; color:#e9bf3c;
        box-shadow: inset 0 1px 0 #fff;
    }
    .modal-title{
        font-size: clamp(20px, 3.6vw, 28px);
        font-weight: 900; margin:0; color:#111827;
    }
    .modal-body{
        color:#111827; font-size: 16px; margin: 6px 0 18px;
    }
    .modal-actions{
        display:flex; justify-content:flex-end; gap:14px; align-items:center;
    }
    .btn-ghost{
        background: transparent; border:0; font-weight:800; color:#111827;
        padding: 12px 18px; border-radius: 999px; cursor:pointer;
    }
    .btn-primary{
        background:#0b1240; color:#fff; border:0; cursor:pointer;
        padding: 12px 28px; border-radius: 999px; font-weight:800;
        box-shadow: 0 8px 20px rgba(11,18,64,.35);
    }
    .btn-primary:active{ transform: translateY(1px); }

</style>

<div class="page">
    <div class="container">

        <!-- HERO -->
        <section class="hero">
            <div>
                <h1>Evaluación ética inicial</h1>
                <p>Conversemos; haré preguntas cortas y te avisaré cuando tengamos lo mínimo para analizar.</p>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
        <span class="pill {ready || minInfoOK() ? 'green' : 'yellow'}">
          {ready || minInfoOK() ? 'Listo para analizar' : 'Aún faltan datos'}
        </span>
            </div>
        </section>

        <!-- NOMBRE -->
        <section class="card pad">
            <div class="label">Nombre de la evaluación</div>
            <input class="input" bind:value={nombre} placeholder="Ej.: Reportaje sobre acceso a la justicia en zonas rurales" />
            <div class="hint">Se autogenera al iniciar; puedes cambiarlo en cualquier momento.</div>
        </section>

        <!-- GRID principal -->
        <div class="layout">
            <!-- CHAT -->
            <section class="card chat" style="overflow:hidden">
                <div class="chathead"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align:middle; margin-right:6px;">
                    <rect x="4" y="7" width="16" height="10" rx="4" fill="#e9bf3c" stroke="#374151" stroke-width="1.5"/>
                    <rect x="9" y="2" width="6" height="4" rx="2" fill="#fff" stroke="#374151" stroke-width="1"/>
                    <circle cx="8" cy="12" r="1.5" fill="#374151"/>
                    <circle cx="16" cy="12" r="1.5" fill="#374151"/>
                    <rect x="10" y="15" width="4" height="2" rx="1" fill="#374151"/>
                    <line x1="2" y1="10" x2="4" y2="10" stroke="#374151" stroke-width="1"/>
                    <line x1="20" y1="10" x2="22" y2="10" stroke="#374151" stroke-width="1"/>
                </svg> Tutor IA</div>
                <div id="chatbox" class="chatbody">
                    {#each messages as m}
                        <div class="msg {m.role}">{m.content}</div>
                    {/each}
                </div>
                <div class="composer">
          <textarea
                  class="textarea"
                  bind:value={input}
                  placeholder="Escribe tu mensaje… (Shift+Enter para salto de línea)"
                  on:keydown={(e) => { if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); send(); } }}
          />
                    <button class="btn" on:click={send} disabled={!draftId || sending}>
                        {sending ? 'Generando…' : 'Enviar'}
                    </button>
                </div>
            </section>

            <!-- PANEL META (no elimina nada del footer; es un refuerzo visual) -->
            <aside class="card pad panel">
                <div>
                    <div class="label" style="margin:0 0 8px;">Estado del brief</div>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <span class="pill {etapa ? 'green' : ''}">Etapa: {etapa ?? '—'}</span>
                        <span class="pill {descripcion && descripcion.trim().length >= 20 ? 'green' : ''}">
              Descripción {descripcion?.trim().length ? `(${descripcion.trim().length} chars)` : '(vacía)'}
            </span>
                        <span class="pill {herramientas ? 'green' : ''}">Herramientas: {herramientas || '—'}</span>
                    </div>
                </div>

                <div class="meta-block">
                    <h4>Descripción</h4>
                    {#if descripcion?.trim().length}
                        <p class="meta-text">{descripcion}</p>
                    {:else}
                        <p class="meta-empty">Aún no hay descripción.</p>
                    {/if}
                </div>

                <div class="meta-block">
                    <h4>Herramientas</h4>
                    {#if herramientas?.trim().length}
                        <p class="meta-text">{herramientas}</p>
                    {:else}
                        <p class="meta-empty">Sin herramientas indicadas.</p>
                    {/if}
                </div>

                <div class="meta-block">
                    <h4>Consejo</h4>
                    <p class="meta-text">
                        {#if ready || minInfoOK()} ✅ Parece que ya está listo para el análisis. Cuando estés conforme, continúa para generar la evaluación ética.
                        {:else} Necesito más información para preparar el análisis ético. Por favor, proporciona más detalles sobre tu proyecto.
                        {/if}
                        </p>
                </div>
            </aside>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <!--div class="hint">
                <b>Etapa:</b> {etapa ?? '—'} ·
                <b>Descripción:</b> {(descripcion?.length ?? 0) > 0 ? `${descripcion}` : '—'} ·
                <b>Herramientas:</b> {herramientas || '—'}
                {#if ready || minInfoOK()} · ✅ Parece que ya está listo para el análisis.{/if}
            </div-->
            <div></div>
            <div style="display:flex; gap:8px; align-items:center;">
                {#if error}<span class="error">{error}</span>{/if}
                <button class="btn primary" on:click={continuar} disabled={sending || (!ready && !minInfoOK())}>
                    Continuar con evaluación ética
                </button>
            </div>
        </div>

    </div>
    {#if showCongrats}
        <div class="modal-overlay" on:click={closeCongrats} role="dialog" aria-modal="true" aria-labelledby="congrats-title">
            <div class="modal-card" on:click|stopPropagation>
                <div class="modal-head">
                    <div class="modal-icon" aria-hidden="true">
                        <!-- carita/robot simple -->
                        <svg viewBox="0 0 24 24" width="26" height="26">
                            <rect x="3" y="7" width="18" height="12" rx="6" fill="currentColor" opacity=".9"/>
                            <rect x="9" y="3" width="6" height="4" rx="2" fill="#0b1240" opacity=".08"/>
                            <circle cx="9" cy="13" r="1.6" fill="#0b1240"/>
                            <circle cx="15" cy="13" r="1.6" fill="#0b1240"/>
                        </svg>
                    </div>
                    <h2 id="congrats-title" class="modal-title">¡100% alcanzado!</h2>
                </div>

                <p class="modal-body">¿Listo para ir a revisar el resultado de tu evaluación?</p>

                <div class="modal-actions">
                    <button class="btn-ghost" type="button" on:click={closeCongrats}>Volver</button>
                    <button class="btn-primary" type="button" on:click={goToResults}>Sí</button>
                </div>
            </div>
        </div>
    {/if}


</div>
