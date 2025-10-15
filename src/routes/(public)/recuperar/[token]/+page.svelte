<script lang="ts">
    import { API_BASE } from '$lib/config';
    import { base } from '$app/paths';
    import { page } from '$app/stores';

    let password = '';
    let confirm = '';
    let show = false;
    let loading = false;
    let err = '';
    let ok = false;

    $: token = $page.params.token;

    const strongEnough = (s: string) => s.length >= 8; // ajusta si quieres reglas más fuertes

    async function submit() {
        err = '';
        if (!strongEnough(password)) { err = 'Mínimo 8 caracteres.'; return; }
        if (password !== confirm) { err = 'Las contraseñas no coinciden.'; return; }

        loading = true;
        try {
            const res = await fetch(`${API_BASE}/auth/password/reset`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ token, password }),
                credentials: 'include',
                mode: 'cors'
            });
            if (!res.ok) throw new Error((await res.text()) || 'Error');
            ok = true;
        } catch (e: any) {
            err = e.message || 'No se pudo actualizar la contraseña.';
        } finally {
            loading = false;
        }
    }
</script>

<style>
    :root{ --cream:#f7efd2; --ink:#1f2937; --muted:#6b7280; --card:#fff; --line:#ece5d6; --yellow:#e9bf3c; --shadow:0 18px 40px rgba(0,0,0,.12); --radius:22px; }
    .page{ min-height:100dvh; background:var(--cream); display:grid; place-items:center; padding:32px 14px; color:var(--ink) }
    .card{ width:100%; max-width:520px; background:var(--card); border:1px solid var(--line); border-radius:var(--radius); box-shadow:var(--shadow) }
    .head{ padding:18px; border-bottom:1px solid var(--line); background:linear-gradient(180deg,#fff7d6,#fff); display:flex; justify-content:space-between; align-items:center }
    .head h1{ margin:0; font-size:clamp(20px,4.2vw,28px); font-weight:900 }
    .pill{ padding:8px 12px; border-radius:999px; border:1px solid var(--line); background:#fff; font-weight:800; box-shadow:0 8px 18px rgba(0,0,0,.08) }
    .body{ padding:18px; display:grid; gap:12px }
    label{ font-weight:800; font-size:14px }
    .inputWrap{ position:relative }
    .input{ width:100%; border:1px solid var(--line); border-radius:12px; padding:12px 96px 12px 12px; outline:none }
    .input:focus{ border-color:#f0c95c; box-shadow:0 0 0 4px rgba(233,191,60,.25) }
    .toggle{ position:absolute; right:6px; top:50%; transform:translateY(-50%); border:0; background:#fff; border-left:1px solid #eee; padding:8px 10px; border-radius:8px; cursor:pointer; color:#6b7280 }
    .btn{ border:0; border-radius:999px; padding:12px 16px; font-weight:800; cursor:pointer; color:#5b4705; background:linear-gradient(180deg,#f7e2a0,#f0c95c); box-shadow:0 12px 24px rgba(233,191,60,.35) }
    .btn:disabled{ opacity:.7; cursor:not-allowed; box-shadow:none }
    .err{ color:#b91c1c; font-weight:700 }
    .ok{ background:#ebfdf5; border:1px solid #ccf5e7; color:#065f46; border-radius:12px; padding:12px; }
</style>

<div class="page">
    <section class="card" role="form" aria-labelledby="reset-title">
        <div class="head">
            <h1 id="reset-title">Nueva contraseña</h1>
            <span class="pill">Paso 2 de 2</span>
        </div>

        <div class="body">
            {#if ok}
                <div class="ok">¡Listo! Tu contraseña fue actualizada.</div>
                <div style="display:flex; gap:8px; margin-top:10px;">
                    <a class="pill" href={`${base}/login`}>Ir a Acceso</a>
                </div>
            {:else}
                <div class="inputRow">
                    <label for="p1">Contraseña</label>
                    <div class="inputWrap">
                        <input id="p1" class="input" type={show ? 'text' : 'password'} bind:value={password} placeholder="••••••••" autocomplete="new-password" />
                        <button type="button" class="toggle" on:click={() => show = !show}>{show ? 'Ocultar' : 'Mostrar'}</button>
                    </div>
                </div>

                <div class="inputRow">
                    <label for="p2">Confirmar contraseña</label>
                    <input id="p2" class="input" type={show ? 'text' : 'password'} bind:value={confirm} placeholder="••••••••" autocomplete="new-password" />
                </div>

                {#if err}<div class="err">{err}</div>{/if}

                <button class="btn" on:click={submit} disabled={loading || !password || !confirm}>
                    {loading ? 'Actualizando…' : 'Actualizar contraseña'}
                </button>
            {/if}
        </div>
    </section>
</div>
