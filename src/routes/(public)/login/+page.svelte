<!-- src/routes/(public)/login/+page.svelte -->

<script lang="ts">
    import { base } from '$app/paths';
    let email = ''; let password = ''; let err = ''; let loading = false;

    async function submit(kind: 'login'|'register'){
        loading = true; err = '';
        try {
            const res = await fetch(`${base}/api/auth/${kind}`, {
                method: 'POST',
                headers: {'content-type':'application/json'},
                body: JSON.stringify({ email, password })
            });
            if(!res.ok){ throw new Error((await res.text()) || 'Error'); }
            // cookies vienen por Set-Cookie (proxy las mantiene)
            window.location.href = `${base}/inicio`;
        } catch(e:any){ err = e.message; }
        loading = false;
    }
</script>

<h1>Acceso</h1>
<div class="card" style="max-width:420px">
    <div style="display:grid;gap:8px">
        <input class="input" placeholder="Email" type="email" bind:value={email}/>
        <input class="input" placeholder="Contraseña" type="password" bind:value={password}/>
        {#if err}<p style="color:#b91c1c">{err}</p>{/if}
        <div style="display:flex; gap:8px">
            <button class="button" disabled={loading} on:click={() => submit('login')}>Entrar</button>
            <button class="button" disabled={loading} on:click={() => submit('register')} style="background:#fff;color:#111;border:1px solid #e5e7eb">Crear cuenta</button>
        </div>
    </div>
</div>
