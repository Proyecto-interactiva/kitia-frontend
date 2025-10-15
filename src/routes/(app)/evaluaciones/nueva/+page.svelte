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

    // Estado “extraído” (meta) que llega desde el backend (SSE event: meta)
    let etapa: Etapa | null = null;
    let descripcion = '';
    let herramientas = '';
    let ready = false; // flag de “listo para análisis” calculado por backend + heurística

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
            // Mensaje inicial (también lo puedes renderizar desde backend)
            push('assistant', '👋 Hola, soy tu Tutor IA. Cuéntame brevemente tu objetivo y en qué etapa del proyecto te encuentras.\n\nPara orientarte mejor, estas son las etapas que suelo manejar:\n\t - Creación de Contenidos \n\t - Revisión y Validación \n\t - Publicación y Difusión \n\t -Posproducción \n\t -MonitoreoPlanificación.\n\n Te haré algunas preguntas y cuando creas que está todo lo que necesitas compartir puedes hacer clic en "Continuar con evaluación ética". ¡Empecemos!');

        }catch(e:any){
            error = e?.message || 'No se pudo iniciar el chat.';
        }
    });

        async function typewriter(text: string, targetIndex: number, delay = 12) {
            // añade la respuesta como mensaje "assistant" vacío si no existe
            if (messages[targetIndex]?.role !== 'assistant') {
                messages = [...messages, { role: 'assistant', content: '', ts: Date.now() }];
                targetIndex = messages.length - 1;
            }
            for (let i = 0; i < text.length; i++) {
                messages[targetIndex].content += text[i];
                messages = [...messages];
                await new Promise(r => setTimeout(r, delay));
            }
        }

    async function send(){
        const text = input.trim();
        if(!text || !draftId) return;
        error = '';
        // 1) Pinta mensaje de usuario
        messages = [...messages, { role:'user', content:text, ts:Date.now() }];
        input = '';

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

            // 2) “finge” streaming escribiendo la respuesta con efecto de tipeo
            await typewriter(data.reply, messages.length);

            // 3) Actualiza meta/ready
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
            // opcional: enlazar conversación
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
</script>

<style>
    :root{ --bg:#f7f7fb; --ink:#111827; --muted:#6b7280; --line:#e5e7eb; --card:#fff; }
    .wrap{ min-height:100dvh; background:var(--bg); color:var(--ink); display:flex; }
    .container{ max-width:860px; margin:0 auto; padding:16px; width:100%; display:flex; flex-direction:column; gap:12px; }
    .h1{ font-size:22px; font-weight:700; margin:8px 0 0; }
    .sub{ color:var(--muted); margin:0 0 8px; }

    .card{ background:var(--card); border:1px solid var(--line); border-radius:14px; padding:12px; }
    .label{ font-weight:600; margin-bottom:6px; }
    .input{ width:100%; border:1px solid var(--line); border-radius:10px; padding:10px 12px; }

    .chat{ display:flex; flex-direction:column; gap:10px; background:var(--card); border:1px solid var(--line); border-radius:16px; min-height:50vh; }
    .chathead{ padding:12px; border-bottom:1px solid var(--line); display:flex; gap:8px; align-items:center; }
    .chatbody{ padding:12px; overflow:auto; max-height:55vh; min-height:40vh; }
    .msg{ max-width:80%; margin:8px 0; padding:10px 12px; border-radius:14px; line-height:1.35; white-space:pre-wrap; }
    .assistant{ background:#f3f4f6; border:1px solid #e5e7eb; color:#111827; border-top-left-radius:6px; }
    .user{ background:#111827; color:#fff; margin-left:auto; border-top-right-radius:6px; }
    .composer{ display:flex; gap:8px; padding:12px; border-top:1px solid var(--line); background:linear-gradient(180deg, rgba(255,255,255,0.55), #fff); }
    .textarea{ flex:1; border:1px solid var(--line); border-radius:12px; padding:10px 12px; resize:none; height:46px; }
    .btn{ appearance:none; border:1px solid var(--line); background:#fff; color:#111827; border-radius:10px; padding:12px 16px; cursor:pointer; font-weight:700; }
    .btn.primary{ background:#111827; color:#fff; border-color:#111827; }
    .hint{ font-size:13px; color:var(--muted); }
    .footer{ display:flex; justify-content:space-between; align-items:center; gap:10px; }
    .error{ color:#b91c1c; }
    .btn.primary:disabled {
        background: #e5e7eb;
        color: #6b7280;
        border-color: #e5e7eb;
        cursor: not-allowed;
        opacity: 0.7;
    }
</style>

<div class="wrap">
    <div class="container">
        <h1 class="h1">Evaluación ética inicial</h1>
        <p class="sub">Conversemos; haré preguntas cortas y te avisaré cuando tengamos lo mínimo para analizar.</p>

        <!-- Nombre siempre presente -->
        <section class="card">
            <div class="label">Nombre de la evaluación</div>
            <input class="input" bind:value={nombre} placeholder="Ej.: Reportaje sobre acceso a la justicia en zonas rurales" />
            <div class="hint">Se autogenera al iniciar; puedes cambiarlo en cualquier momento.</div>
        </section>

        <!-- Chat -->
        <section class="chat">
            <div class="chathead">🧭 Tutor ético</div>
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
                <button class="btn" on:click={send} disabled={!draftId || sending}>{sending ? 'Generando…' : 'Enviar'}</button>
            </div>
        </section>

        <!-- Footer con estado y CTA -->
        <div class="footer">
            <div class="hint">
                <b>Etapa:</b> {etapa ?? '—'} ·
                <b>Descripción:</b> {(descripcion?.length ?? 0) > 0 ? `${descripcion}` : '—'} ·
                <b>Herramientas:</b> {herramientas || '—'}
                {#if ready || minInfoOK()} · ✅ Parece que ya está listo para el análisis.{/if}
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
                {#if error}<span class="error">{error}</span>{/if}
                <button class="btn primary" on:click={continuar} disabled={sending || (!ready && !minInfoOK())}>
                    Continuar con evaluación ética
                </button>
            </div>
        </div>
    </div>
</div>
