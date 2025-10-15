<script lang="ts">
    import { API_BASE } from '$lib/config';
    import { base } from '$app/paths';

    let email = '';
    let loading = false;
    let done = false;
    let err = '';

    async function submit() {
        if (!email.trim()) return;
        loading = true; err = '';
        try {
            await fetch(`${API_BASE}/auth/password/forgot`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email }),
                credentials: 'include',
                mode: 'cors'
            });
            // Siempre mostramos éxito (sin filtrar por existencia del correo)
            done = true;
        } catch (e: any) {
            // Igual marcamos done para no filtrar existencia; log opcional
            done = true;
        } finally {
            loading = false;
        }
    }

    const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); submit(); }
    };
</script>

<style>
    :root{ --cream:#f7efd2; --ink:#1f2937; --muted:#6b7280; --card:#fff; --line:#ece5d6;
        --yellow:#e9bf3c; --shadow:0 18px 40px rgba(0,0,0,.12); --radius:22px; }
    .page{ min-height:100dvh; background:var(--cream); display:grid; place-items:center; padding:32px 14px; color:var(--ink) }
    .card{ width:100%; max-width:520px; background:var(--card); border:1px solid var(--line); border-radius:var(--radius); box-shadow:var(--shadow) }
    .head{ padding:18px; border-bottom:1px solid var(--line); background:linear-gradient(180deg,#fff7d6,#fff); display:flex; justify-content:space-between; align-items:center }
    .head h1{ margin:0; font-size:clamp(20px,4.2vw,28px); font-weight:900 }
    .pill{ padding:8px 12px; border-radius:999px; border:1px solid var(--line); background:#fff; font-weight:800; box-shadow:0 8px 18px rgba(0,0,0,.08) }
    .body{ padding:18px; display:grid; gap:12px }
    label{ font-weight:800; font-size:14px }
    .input{ width:100%; border:1px solid var(--line); border-radius:12px; padding:12px; outline:none }
    .input:focus{ border-color:#f0c95c; box-shadow:0 0 0 4px rgba(233,191,60,.25) }
    .btn{ border:0; border-radius:999px; padding:12px 16px; font-weight:800; cursor:pointer; color:#5b4705;
        background:linear-gradient(180deg,#f7e2a0,#f0c95c); box-shadow:0 12px 24px rgba(233,191,60,.35) }
    .btn:disabled{ opacity:.7; cursor:not-allowed; box-shadow:none }
    .hint{ color:var(--muted); font-size:13px }
    .ok{ background:#ebfdf5; border:1px solid #ccf5e7; color:#065f46; border-radius:12px; padding:12px; }
</style>

<div class="page">
    <section class="card" role="form" aria-labelledby="rec-title">
        <div class="head">
            <h1 id="rec-title">Recuperar contraseña</h1>
            <span class="pill">Paso 1 de 2</span>
        </div>

        <div class="body">
            {#if !done}
                <div>
                    <label for="email">Email</label>
                    <input id="email" class="input" type="email" placeholder="tu@correo.com" bind:value={email} on:keydown={onKey} autocomplete="email" />
                    <p class="hint">Te enviaremos un enlace temporal para restablecer tu clave.</p>
                </div>
                {#if err}<div style="color:#b91c1c;font-weight:700">{err}</div>{/if}
                <button class="btn" on:click={submit} disabled={loading || !email.trim()}>
                    {loading ? 'Enviando…' : 'Enviar enlace'}
                </button>
            {:else}
                <div class="ok">Si el correo está registrado, te enviamos un enlace para cambiar tu contraseña. Revisa tu bandeja y spam.</div>
                <div style="display:flex; gap:8px; margin-top:10px;">
                    <a class="pill" href={`${base}/login`}>Volver al acceso</a>
                </div>
            {/if}
        </div>
    </section>
</div>
