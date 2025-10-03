<!-- src/routes/(public)/login/+page.svelte -->

<script lang="ts">
    import { API_BASE } from '$lib/config';
    import { base } from '$app/paths';
    let email = ''; let password = ''; let err = ''; let loading = false;

    async function submit(kind: 'login' | 'register') {
        loading = true; err = '';
        try {
            const res = await fetch(`${API_BASE}/auth/${kind}`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',   // si usas cookies; si solo usas bearer, puedes quitarlo
                mode: 'cors',
            });

            if (!res.ok) {
                throw new Error((await res.text()) || 'Error');
            }

            const data = await res.json();   // 👈 aquí lees el JSON
            console.log('login data', data);

            // guarda el bearer si no usas cookies
            localStorage.setItem('access_token', data.access_token);

            // redirige
            window.location.href = `${base}/tutor/`;
        } catch (e: any) {
            err = e.message;
        } finally {
            loading = false;
        }
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
