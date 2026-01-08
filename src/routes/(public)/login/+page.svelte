<!-- src/routes/(public)/login/+page.svelte -->
<script lang="ts">
    import { API_BASE } from '$lib/config';
    import { base } from '$app/paths';
    import {onMount} from "svelte";

    let email = '';
    let password = '';
    let err = '';
    let loading = false;
    let showPass = false;

    let backendReady = false;

    onMount(() => {
        // Check backend health on mount
        const checkHealth = async () => {
            try {
                const res = await fetch(`${API_BASE}/health`);
                if (res.ok) {
                    backendReady = true;
                    console.log("Conectado al servidor");
                } else {
                    throw new Error('Backend not ready');
                }
            } catch (e) {
                console.log("Backend no disponible");
            }
        };
        checkHealth();

        // Ping backend every 5 minutes to keep alive
        const ping = async () => {
            try {
                const res = await fetch(`${API_BASE}/health`);
                if (res.ok) {
                    backendReady = true;
                    console.log("Conectado al servidor");
                } else {
                    backendReady = false;
                    console.log("Backend no disponible");
                }
            } catch (e) {
                backendReady = false;
                console.log("Backend no disponible");
            }
        };
        const interval = setInterval(ping, 30000); // 5 minutes
        return () => clearInterval(interval); // cleanup on unmount
    });

    async function submit(kind: 'login' | 'register') {
        loading = true; err = '';
        try {
            const res = await fetch(`${API_BASE}/auth/${kind}`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
                mode: 'cors',
            });

            if (!res.ok) throw new Error((await res.text()) || 'Error');

            const data = await res.json();
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('email', email);
            window.location.href = `${base}/app/`;
        } catch (e: any) {
            err = e.message;
        } finally {
            loading = false;
        }
    }

    const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submit('login');
        }
    };
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

        --shadow-lg:0 22px 50px rgba(0,0,0,.16);
        --shadow:0 14px 28px rgba(0,0,0,.12);
        --radius:22px;
    }

    .page{ min-height:100dvh; background: var(--cream); display:grid; place-items:center; padding: 32px 14px; color: var(--ink); }

    .auth{
        width: 100%;
        max-width: 520px;
        background:#fff; border:1px solid var(--line); border-radius: var(--radius);
        box-shadow: var(--shadow-lg); overflow: hidden;
    }

    .head{
        padding: 18px;
        background: linear-gradient(180deg, #fff7d6, #fff);
        border-bottom:1px solid var(--line);
        display:flex; align-items:center; justify-content:space-between; gap:10px;
    }
    .head h1{ margin:0; font-size: clamp(20px,4.2vw,28px); font-weight:900; letter-spacing:.2px; }
    .pill{
        display:inline-flex; align-items:center; justify-content:center;
        padding: 8px 12px; border-radius: 999px; font-weight:800;
        background:#fff; border:1px solid var(--line); box-shadow: 0 8px 18px rgba(0,0,0,.08);
    }

    .body{ padding: 18px; display:grid; gap: 12px; }

    label{ font-weight:800; font-size: 14px; }
    .inputRow{ display:grid; gap:6px; }
    .inputWrap{ position:relative; display:flex; align-items:center; }
    .input{
        width:100%; border:1px solid var(--line); border-radius: 12px; padding: 12px 40px 12px 12px; outline:none;
        background:#fff; color:var(--ink); font-size:14px;
    }
    .input:focus{ border-color:#f0c95c; box-shadow: 0 0 0 4px rgba(233,191,60,.25); }

    .toggle{
        position:absolute; right:6px; top:50%; transform: translateY(-50%);
        border:0; background:#fff; border-left:1px solid #eee; height:70%;
        padding: 0 10px; cursor:pointer; border-radius: 8px; color:#6b7280;
    }

    .err{ color:#b91c1c; margin: 6px 0 0; font-weight:700; }

    .actions{ display:flex; gap:10px; flex-wrap:wrap; margin-top:4px; }
    .btn{
        appearance:none; border:1px solid var(--line); background:#fff; color:#374151;
        border-radius: 999px; padding: 12px 16px; cursor:pointer; font-weight:800;
        box-shadow: 0 8px 18px rgba(0,0,0,.08);
    }
    .btn.primary{
        border:0; color:#5b4705;
        background: linear-gradient(180deg, #f7e2a0, #f0c95c);
        box-shadow: 0 12px 24px rgba(233,191,60,.35);
    }
    .btn:disabled{ opacity:.7; cursor:not-allowed; box-shadow:none; }

    .foot{
        padding: 14px 18px; border-top:1px solid var(--line);
        display:flex; justify-content:space-between; align-items:center; gap:12px; color: var(--muted);
        background:#fff;
    }
    .help{ font-size:13px; }
    .link{ color:#374151; text-decoration: underline; text-underline-offset: 3px; }

    /* Loader pill */
    .loading{
        display:inline-flex; align-items:center; gap:8px; font-weight:800; color:#6a5408;
    }
    .dot{
        width: 14px; height: 14px; border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #ffd978, var(--yellow));
        box-shadow: 0 6px 12px rgba(0,0,0,.12), inset 0 1px 0 #fff;
        animation: hop .9s infinite cubic-bezier(.36,.07,.19,.97);
    }
    .dot:nth-child(2){ animation-delay: .1s }
    .dot:nth-child(3){ animation-delay: .2s }
    @keyframes hop{ 0%,80%,100%{ transform: translateY(0) } 40%{ transform: translateY(-6px) } }
    .access-instructions {
        margin-bottom: 1.5rem;
        color: var(--text-muted, #555);
        line-height: 1.5;
    }

    .access-instructions strong {
        color: var(--text-primary, #222);
    }

    .backend-loading {
        text-align: center;
        padding: 40px;
        color: var(--muted);
    }
    .backend-loading h2 {
        color: var(--ink);
        margin-bottom: 16px;
    }
</style>

<div class="page">
    {#if !backendReady}
        <div class="backend-loading">
            <h2>Conectando con el servidor...</h2>
            <p>Estamos estableciendo una conexión segura. Esto puede tardar unos instantes.</p>
        </div>
    {:else}
        <section class="auth" role="form" aria-labelledby="title-login">
            <div class="head">
                <h1 id="title-login">Acceso</h1>
            </div>

            <div class="body">
                <p class="subtitle access-instructions">
                    <strong>¿Primera vez en KitIA?</strong>
                    <br />
                    Ingresa tu email y crea una contraseña, luego haz clic en
                    <strong>Crear cuenta</strong>.
                </p>
                <p class="subtitle access-instructions">
                    <strong>¿Ya tienes cuenta?</strong>
                    <br />
                    Ingresa tus datos y haz clic en
                    <strong>Entrar</strong>.
                </p>

                <div class="inputRow">
                    <label for="email">Email</label>
                    <div class="inputWrap">
                        <input
                                id="email"
                                class="input"
                                type="email"
                                placeholder="tu@correo.com"
                                bind:value={email}
                                on:keydown={onKey}
                                autocomplete="email"
                        />
                    </div>
                </div>

                <div class="inputRow">
                    <label for="pass">Contraseña</label>
                    <div class="inputWrap">
                        <input
                                id="pass"
                                class="input"
                                type={showPass ? 'text' : 'password'}
                                placeholder="••••••••"
                                bind:value={password}
                                on:keydown={onKey}
                                autocomplete="current-password"
                        />
                        <button type="button" class="toggle" aria-label="Mostrar u ocultar contraseña" on:click={() => showPass = !showPass}>
                            {showPass ? 'Ocultar' : 'Mostrar'}
                        </button>
                    </div>
                </div>

                {#if err}<p class="err">{err}</p>{/if}

                <div class="actions">
                    <button class="btn primary" disabled={loading} on:click={() => submit('login')}>
                        {#if loading}
                            <span class="loading"><span class="dot"></span><span class="dot"></span><span class="dot"></span> Entrando…</span>
                        {:else}
                            Entrar
                        {/if}
                    </button>
                    <button
                            class="btn"
                            disabled={loading}
                            on:click={() => submit('register')}
                            aria-label="Crear cuenta nueva"
                    >
                        Crear cuenta
                    </button>
                </div>
            </div>

            <div class="foot">
                <span class="help">¿Olvidaste tu contraseña? <a class="link" href={`${base}/recuperar`}>Recupérala</a></span>
                <span class="help">¿Problemas? <a class="link" href={`mailto:kitia.app@gmail.com`}>Contáctanos</a></span>
            </div>
        </section>
    {/if}
</div>
