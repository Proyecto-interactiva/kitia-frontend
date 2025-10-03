<!-- src/routes/(app)/+layout.svelte -->
<script lang="ts">
    import { base } from '$app/paths';
    import { API_BASE } from '$lib/config';

    // rutas de imágenes (ajústalas a tus archivos reales)
    const IMG = {
        logo: '/kitia-frontend/img/logo-kitia.svg',
        kitmu: '/kitia-frontend/img/logo-kitmu.svg',
        sealLeft: '/kitia-frontend/img/seal-left.svg',
        sealRight: '/kitia-frontend/img/seal-right.svg'
    };

    let logoBroken = false;
    let kitmuBroken = false;

    const navLinks = [
        { href: `${base}/inicio#bitacora`, label: 'Bitácora Ética', pill: 'rose' },
        { href: `${base}/tutor#fastcheck`, label: 'Fast-check Ético', pill: 'yellow' },
        { href: `${base}/tutoriales`, label: 'Tutoriales', pill: 'green' }
    ];

    async function logout() {
        await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
        localStorage.removeItem('access_token');
        window.location.href = `${base}/login`;
    }
</script>

<header class="topbar">
    <a href={`${base}/tutor`} class="brand" aria-label="Inicio">
        <img
                src={IMG.logo}
                alt="kitIA"
                class="brand-logo"
                hidden={logoBroken}
                on:error={() => (logoBroken = true)}
        />
        {#if logoBroken}
            <span class="brand-fallback">kit<span>IA</span></span>
        {/if}
    </a>

    <nav class="nav">
        {#each navLinks as n}
            <a class="pill {n.pill}" href={n.href}>{n.label}</a>
        {/each}
    </nav>

    <div class="actions">
        <a href={`${base}/kitmu`} class="kitmu" aria-label="KitMU">
            <img
                    src={IMG.kitmu}
                    alt="KitMU"
                    hidden={kitmuBroken}
                    on:error={() => (kitmuBroken = true)}
            />
            {#if kitmuBroken}
                <span class="kitmu-fallback">kit<span>mu</span></span>
            {/if}
        </a>
        <button class="logout" on:click={logout}>Cerrar sesión</button>
        <button class="menu" aria-label="Abrir menú">
            <span></span><span></span><span></span>
        </button>
    </div>
</header>

<main class="container">
    <slot />
</main>

<footer class="footer">
    <div class="seal">
        <img src={IMG.sealLeft} alt="Pontificia Universidad Católica de Chile" />
        <div class="links">
            <a href={`${base}/quienes-somos`}>Quienes somos</a>
            <a href={`${base}/contacto`}>Contacto</a>
            <a href={`${base}/kitmu`}>Kitmu</a>
            <a href={`${base}/kit-movil`}>Kit móvil</a>
        </div>
    </div>
    <div class="seal">
        <img src={IMG.sealRight} alt="Facultad de Comunicaciones" />
    </div>
</footer>

<style>
    :root{
        --bg:#faf7ef;
        --panel:#ffffff;
        --text:#1f2937;
        --muted:#6b7280;

        --rose:#c86c8a;   /* pills rosado */
        --yellow:#e9bf3c; /* pills amarillo */
        --green:#37b56f;  /* pills verde */

        --radius: 22px;
        --shadow: 0 18px 40px rgba(0,0,0,.12);
        --ring: 0 0 0 3px rgba(0,0,0,.06);
    }

    .topbar{
        position: sticky; top:0; z-index:10;
        display:flex; align-items:center; justify-content:space-between;
        gap: 12px;
        padding: 14px 18px;
        background: var(--panel);
        border-bottom: 1px solid #ececec;
    }

    .brand{ display:flex; align-items:center; gap:10px; text-decoration:none; }
    .brand-logo{ height:48px; width:auto; display:block; }
    .brand-fallback{ font-weight:900; font-size:28px; color:#333 }
    .brand-fallback span{ color: var(--green) }

    .nav{ display:flex; align-items:center; gap:12px; }
    .pill{
        display:inline-flex; align-items:center; justify-content:center;
        padding: 10px 16px; border-radius: 999px; font-weight:800; text-decoration:none;
        color:#fff; border:0;
        box-shadow: 0 12px 26px rgba(0,0,0,.12);
        transition: transform .12s ease;
    }
    .pill:hover{ transform: translateY(-1px); }
    .pill.rose{ background: linear-gradient(180deg, #e8b9c9, #e3a0b7); }
    .pill.yellow{ background: linear-gradient(180deg, #f7e2a0, #f0c95c); }
    .pill.green{ background: linear-gradient(180deg, #b9f0cf, #6ddc9e); }

    .actions{ display:flex; align-items:center; gap:12px; }
    .kitmu img{ height:44px; display:block; }
    .kitmu-fallback{ font-weight:800; font-size:22px }
    .kitmu-fallback span{ color: var(--rose) }

    .logout{
        background: #fff; border: 1px solid #e5e7eb; border-radius: 999px;
        padding: 9px 14px; font-weight:700; color:#374151; cursor:pointer;
        box-shadow: var(--ring);
    }
    .logout:hover{ background:#f9fafb }

    .menu{
        width:42px; height:42px; border-radius: 12px; border:0; background:#fff;
        display:grid; place-items:center; box-shadow: var(--ring); padding:8px;
    }
    .menu span{ display:block; height:2px; width:20px; background:#374151; border-radius:2px }
    .menu span + span{ margin-top:4px }

    .container{
        max-width: 1140px; margin: 0 auto; padding: 24px 16px 48px;
        background: var(--bg);
    }

    .footer{
        background: #0b2b66;
        color: #e6eefc;
        padding: 22px 16px;
        display:flex; justify-content:space-between; align-items:center; gap: 18px;
        border-top-left-radius: var(--radius);
        border-top-right-radius: var(--radius);
    }
    .footer .seal{ display:flex; align-items:center; gap: 16px; }
    .footer img{ height:44px; width:auto; display:block }
    .footer .links{ display:flex; gap:14px; flex-wrap:wrap }
    .footer .links a{ color:#e6eefc; text-decoration:none; font-weight:600 }
    .footer .links a:hover{ text-decoration:underline }

    @media (max-width: 980px){
        .nav{ display:none }  /* simplifica el header en móvil */
        .container{ padding-top:16px }
        .footer{ flex-direction:column; align-items:flex-start }
    }
</style>
