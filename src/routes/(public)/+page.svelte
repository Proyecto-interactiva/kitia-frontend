<script lang="ts">
    import {base} from "$app/paths";
    import { onMount } from 'svelte';
    import {API_BASE} from "$lib/config";

    let test_ping = false;

    onMount(() => {
        if (!test_ping) {
            fetch(`${API_BASE}/health`).then(res => {
                test_ping = true;
                console.log("Conectado al servidor");
            });
        }
    });

    let logoBroken = false;
    let kitmuBroken = false;
    // Ajusta rutas si usas otros nombres/formatos de imagen
    const IMG = {
        logo: "/kitia-frontend/img/logo-kitia.svg",     // opcional, si no existe mostrará texto
        kitmu: "/kitia-frontend/img/logo-kitmu.svg",    // opcional
        hero: "/kitia-frontend/img/hero.jpg",
        people: "/kitia-frontend/img/people.jpg",
        autonomia: "/kitia-frontend/img/pilares/autonomia.png",
        equidad: "/kitia-frontend/img/pilares/equidad.png",
        pluralismo: "/kitia-frontend/img/pilares/pluralismo.png",
        privacidad: "/kitia-frontend/img/pilares/privacidad.png",
        responsabilidad: "/kitia-frontend/img/pilares/responsabilidad.png",
        seguridad: "/kitia-frontend/img/pilares/seguridad.png",
        transparencia: "/kitia-frontend/img/pilares/transparencia.png",
        veracidad: "/kitia-frontend/img/pilares/veracidad.png",
        seal1: "/kitia-frontend/img/seal-left.svg",     // opcional (footer)
        seal2: "/kitia-frontend/img/seal-right.svg"     // opcional (footer)
    };

    const tutoriales = [
        {
            title: "Transparencia y explicabilidad",
            blurb:
                "Etiquetado visible, explicaciones claras, documentación para el público comprensibles.",
            img: IMG.transparencia,
            href: "https://kitmu.cl/kitia/transparencia-y-explicabilidad/"
        },
        {
            title: "Responsabilidad y rendición de cuentas",
            blurb:
                "Protocolos de reporte de errores, asignación de responsables, trazabilidad.",
            img: IMG.responsabilidad,
            href: "https://kitmu.cl/kitia/responsabilidad-y-rendicion-de-cuentas/"
        },
        {
            title: "Privacidad y protección de datos",
            blurb:
                "Minimización de datos, consentimiento, cumplimiento normativo.",
            img: IMG.privacidad,
            href: "https://kitmu.cl/kitia/privacidad-y-proteccion-de-datos/"
        },
        {
            title: "No discriminación y equidad",
            blurb:
                "Verificación de diversidad algorítmica, monitoreo de burbujas de filtro comprensibles.",
            img: IMG.equidad,
            href: "https://kitmu.cl/kitia/no-discriminacion-y-equidad/"
        },
        {
            title: "Seguridad y prevención de daños",
            blurb:
                "Etiquetado visible, explicaciones claras, documentación para el público comprensibles.",
            img: IMG.seguridad,
            href: "https://kitmu.cl/kitia/seguridad-y-prevencion-de-danos/"
        },
        {
            title: "Autonomía humana y control editorial",
            blurb:
                "Supervisión humana para garantizar estándares de profesionalidad.",
            img: IMG.autonomia,
            href: "https://kitmu.cl/kitia/autonomia-humana-y-control-editorial/"
        },
        {
            title: "Veracidad y lucha contra la desinformación",
            blurb:
                "Fact-checking automatizado, limitación de generación engañosa.",
            img: IMG.veracidad,
            href: "https://kitmu.cl/kitia/veracidad-y-lucha-contra-la-desinformacion/"
        },
        {
            title: "Pluralismo y diversidad informativa",
            blurb:
                "Auditoría de sesgos, diversidad de datos, revisión ética.",
            img: IMG.pluralismo,
            href: "https://kitmu.cl/kitia/pluralismo-y-diversidad-informativa/"
        }
    ];
</script>

<div class="page">
    <!-- HEADER -->
    <header class="topbar">
        <a href="/" class="brand" aria-label="Tutor">
            <img
                    src={IMG.logo}
                    alt="KitIA"
                    class="brand-logo"
                    hidden={logoBroken}
                    on:error={() => (logoBroken = true)}
            />
            {#if logoBroken}
                <span class="brand-fallback">kit<span>IA</span></span>
            {/if}
        </a>

        <!--nav class="nav">
            <a class="pill active" href="#bitacora">Principios Éticos</a>
            <a class="pill pill-yellow" href="#fastcheck">Tutor IA</a>
            <a class="pill pill-green" href="#tutoriales">Tutoriales</a>
        </nav-->

        <div class="actions">
            {#if IMG.kitmu}
                <a href="https://kitmu.cl/" class="kitmu" no-referrer aria-label="KitMU" target="_blank">
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
            {/if}
        </div>
    </header>

    <main class="container">
        <!-- FAST CHECK -->
        <section id="fastcheck" class="card fast-card">
            <div class="fast-copy">
                <h2>Tutor IA</h2>
                <p>
                    Comienza una asesoría desde cero sobre tu proceso creativo usando iA.
                </p>
                <a class="btn-white" href="/kitia-frontend/tutor">Empezar</a>
            </div>

            <figure class="fast-media">
                <img src={IMG.hero} alt="Equipo trabajando" />
            </figure>
        </section>

        <!-- TUTORIALES -->
        <section id="pilares" class="tutoriales">
            <h2>Pilares Éticos</h2>

            <div class="grid">
                {#each tutoriales as t}
                    <article class="tcard">
                        <figure class="timg">
                            <img src={t.img} alt={t.title} />
                        </figure>
                        <div class="tbody">
                            <h3>{t.title}</h3>
                            <p>{t.blurb}</p>
                            <a class="play-mini" href={t.href} aria-label="Abrir tutorial" target="_blank" rel="noopener">
                                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                                    <path d="M8 5v14l11-7Z"/>
                                </svg>
                            </a>
                        </div>
                    </article>
                {/each}
            </div>
        </section>
    </main>

    <!-- FOOTER opcional con sellos -->
    <footer class="footer">
        <div class="seal">
            <img src={IMG.seal1} alt="Pontificia Universidad Católica de Chile" />
            <div class="links">
                <a href={`${base}/quienes-somos`}>Quienes somos</a>
                <a href={`${base}/contacto`}>Contacto</a>
                <a href={`${base}/kitmu`}>Kitmu</a>
                <a href={`${base}/kit-movil`}>Kit móvil</a>
            </div>
        </div>
        <div class="seal">
            <img src={IMG.seal2} alt="Facultad de Comunicaciones" />
        </div>
    </footer>
</div>

<style>
    :root{
        --bg: #f7f7f8;
        --text: #1a1a1a;
        --muted:#6b7280;

        --rose-500:#c86c8a;
        --rose-600:#b65c7a;
        --rose-100:#f5e3ea;

        --yellow-500:#e9bf3c;
        --yellow-600:#d9ae28;

        --green-500:#37b56f;
        --green-600:#2fa364;
        --green-100:#e7f6ec;

        --card-radius: 26px;
        --shadow: 0 18px 40px rgba(0,0,0,.15);
    }

    .page{
        min-height:100dvh;
        background: var(--bg);
        color: var(--text);
        font-family: system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Inter, Arial;
    }

    .container{ max-width: 100%; margin: 24px auto 0; padding: 0 0; }

    /* Header */
    .topbar{
        position: sticky; top:0; z-index:10;
        display:flex; align-items:center; justify-content:space-between;
        gap: 12px;
        padding: 14px 24px;
        background: #fff;
        border-bottom: 1px solid #e8eaee;
    }
    .brand-logo{ height:44px; width:auto; display:block; }
    .brand-fallback{ font-weight:900; font-size:28px; letter-spacing:.5px }
    .brand-fallback span{ color: var(--green-600) }

    .nav{
        display:flex; gap:14px; align-items:center;
    }
    .pill{
        display:inline-flex; align-items:center; justify-content:center;
        padding: 10px 16px; border-radius:999px;
        background:#fff; color:#333; text-decoration:none; font-weight:700;
        box-shadow: 0 10px 20px rgba(0,0,0,.08);
        border: 1px solid rgba(0,0,0,.06);
    }
    .pill.active{
        background: linear-gradient(180deg, #CC7A99, #e3a0b7);
        color: #fff; border: 0;
        box-shadow: 0 12px 24px rgba(200,108,138,.35);
    }
    .pill-yellow{
        background: linear-gradient(180deg, #F2C243, #f0c95c);
        color: #fff; border:0;
        box-shadow: 0 12px 24px rgba(233,191,60,.35);
    }
    .pill-green{
        background: linear-gradient(180deg, #66CC66, #6ddc9e);
        color: #fff; border:0;
        box-shadow: 0 12px 24px rgba(55,181,111,.35);
    }

    .actions{ display:flex; align-items:center; gap:14px; }
    .kitmu img{ height:44px; }
    .kitmu-fallback{ font-weight:800; font-size:22px }
    .kitmu-fallback span{ color: var(--rose-600) }

    .menu{ width:40px; height:40px; border:0; background:#fff; border-radius:12px; padding:8px; box-shadow: 0 8px 18px rgba(0,0,0,.08); }
    .menu span{ display:block; height:2px; background:#333; margin:5px 0; border-radius:2px }

    /* Cards base */
    .card{
        background:#fff; border-radius: var(--card-radius);
        box-shadow: var(--shadow);
        overflow:hidden;
    }
    img{ max-width:100%; display:block; }

    /* Hero Bitácora */
    .hero-card{
        display:grid; grid-template-columns: 1.05fr 1fr;
        gap:0; margin: 5%; margin-top: 28px; background: var(--rose-500); padding:0;
    }
    .hero-copy{
        background: var(--rose-500);
        color:#fff; padding: 40px 36px;
    }
    .hero-copy h1{ font-size: clamp(28px, 4.2vw, 48px); margin:0 0 12px }
    .lead{ font-size: clamp(15px, 2vw, 18px); opacity:.95; max-width: 52ch; }
    .how{
        display:inline-block; margin-top: 18px; font-weight:800; color:#fff;
        text-decoration:none; font-style: italic;
    }
    .meta{ margin-top: 8px; opacity:.85 }

    .hero-media{ position:relative; margin: 0; }
    .hero-media img{ width:100%; height:100%; object-fit:cover; }
    .play{
        position:absolute; right:22px; bottom:22px;
        width:64px; height:64px; border-radius:50%;
        background:#fff; border:0; box-shadow: 0 12px 24px rgba(0,0,0,.2);
        display:grid; place-items:center; cursor:pointer;
    }
    .play svg path{ fill: var(--rose-500); }

    /* Fast Check */
    .fast-card{
        margin-top: 28px;
        display:grid; grid-template-columns: 1.05fr 1fr; overflow:hidden;
        background: var(--yellow-500);
        margin: 5% 15%;
        padding: 0;
    }
    .fast-copy{ color:#fff; padding: 40px 36px; }
    .fast-copy h2{ font-size: clamp(26px, 3.8vw, 42px); margin:0 0 10px }
    .fast-copy p{ max-width: 50ch; font-size: clamp(25px, 2vw, 18px) }
    .btn-white{
        margin-top: 20px; display:inline-flex; align-items:center; justify-content:center;
        padding: 12px 22px; background:#fff; color:#a27200; font-weight:800; border-radius:999px;
        text-decoration:none; box-shadow: 0 10px 24px rgba(0,0,0,.2); font-size:18px;
    }
    .fast-media{margin:0;}
    .fast-media img{ width:100%; height:100%; object-fit:cover; }

    /* Tutoriales */
    .tutoriales{ margin-top: 36px; background: var(--green-100); border-radius: 22px; padding: 5% 10%; }
    .tutoriales h2{ color: var(--green-600); font-size: clamp(24px,3.4vw,36px); margin: 6px 6px 18px }
    .grid{
        display:grid; gap: 18px; grid-template-columns: repeat(4, minmax(0,1fr));
    }
    .tcard{ background: #66CC66; border-radius: 20px; box-shadow: 0 10px 26px rgba(0,0,0,.12); overflow:hidden; display:flex; flex-direction:column }
    .timg{ flex-shrink:0; margin: 0; margin-bottom: 20px;background: aliceblue;}
    .timg img{ /*width:100%; height:230px;*/ width: 80px;
        height: 150px;
        object-fit: contain;
        margin: 0 auto;
        padding: 10px; }
    .tbody{ padding: 18px; display:grid; grid-template-columns: 1fr auto; gap: 10px; align-items:start; border-radius: 20px; margin-top: -35px; background: #66CC66; z-index:1; }
    .tbody h3{ grid-column: 1 / -1; margin:0 0 6px; color:#fff; font-size: clamp(18px,2.6vw,24px) }
    .tbody p{ grid-column: 1 / 2; margin:0; color:#fff; max-width: 44ch }
    .play-mini{
        grid-column: 2 / 3; align-self:end; justify-self:end;
        width:42px; height:42px; border-radius:50%; background:#fff; display:grid; place-items:center;
        box-shadow: 0 8px 18px rgba(0,0,0,.15); text-decoration:none;
    }
    .play-mini svg path{ fill: #2fa364 }

    /* Footer */
    .footer{
        background: #0b2b66;
        color: #e6eefc;
        padding: 22px 16px;
        display:flex; justify-content:space-between; align-items:center; gap: 18px;
        border-top-left-radius: var(--radius);
        border-top-right-radius: var(--radius);
        bottom:0;
    }
    .footer .seal{ display:flex; align-items:center; gap: 16px; }
    .footer img{ height:44px; width:auto; display:block }
    .footer .links{ display:flex; gap:14px; flex-wrap:wrap }
    .footer .links a{ color:#e6eefc; text-decoration:none; font-weight:600 }
    .footer .links a:hover{ text-decoration:underline }

    /* Responsive */
    @media (max-width: 980px){
        .nav{ display:none } /* simplifica header en móvil */
        .hero-card, .fast-card{ grid-template-columns: 1fr }
        .hero-media img, .fast-media img{ height: 240px }
        .footer{ flex-direction:column; gap:8px }
        .grid{
            display:grid; gap: 18px; grid-template-columns: repeat(1, minmax(0,1fr));
        }
    }
</style>
