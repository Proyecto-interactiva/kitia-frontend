<script lang="ts">
    import {base} from "$app/paths";
    import { onMount } from 'svelte';
    import {API_BASE} from "$lib/config";

    onMount(() => {
        // Ping backend every 5 minutes to keep alive
        const ping = () => {
            fetch(`${API_BASE}/health`).then(() => {
                console.log("Conectado al servidor");
            });
        };
        ping(); // initial ping
        const interval = setInterval(ping, 60000); // 5 minutes
        return () => clearInterval(interval); // cleanup on unmount
    });

    let logoBroken = false;
    let kitmuBroken = false;
    let showMore = false;
    // Ajusta rutas si usas otros nombres/formatos de imagen
    const IMG = {
        logo: base + "/img/logo-kitia.svg",     // opcional, si no existe mostrará texto
        kitmu: base + "/img/logo-kitmu.svg",    // opcional
        hero: base + "/img/hero.jpg",
        people: base + "/img/people.jpg",
        autonomia: base + "/img/pilares/autonomia.png",
        equidad: base + "/img/pilares/equidad.png",
        pluralismo: base + "/img/pilares/pluralismo.png",
        privacidad: base + "/img/pilares/privacidad.png",
        responsabilidad: base + "/img/pilares/responsabilidad.png",
        seguridad: base + "/img/pilares/seguridad.png",
        transparencia: base + "/img/pilares/transparencia.png",
        veracidad: base + "/img/pilares/veracidad.png",
        seal1: base + "/img/seal-left.svg",     // opcional (footer)
        seal2: base + "/img/seal-right.svg",     // opcional (footer)
        stages: base + "/img/diagrama-etapas.svg",
        runway: base + "https://img.youtube.com/vi/wa5RcsQ4p3U/maxresdefault.jpg",
        adobe: base + "https://img.youtube.com/vi/XQOdtMnUTSs/maxresdefault.jpg"
    };

    const tutoriales = [
        {
            title: "Transparencia y explicabilidad",
            blurb:
                "Etiquetado visible, explicaciones claras, documentación para el público comprensibles.",
            img: IMG.transparencia,
            href: "https://kitmu.cl/sobre-kitia/transparencia-y-explicabilidad/"
        },
        {
            title: "Responsabilidad y rendición de cuentas",
            blurb:
                "Protocolos de reporte de errores, asignación de responsables, trazabilidad.",
            img: IMG.responsabilidad,
            href: "https://kitmu.cl/sobre-kitia/responsabilidad-y-rendicion-de-cuentas/"
        },
        {
            title: "Privacidad y protección de datos",
            blurb:
                "Minimización de datos, consentimiento, cumplimiento normativo.",
            img: IMG.privacidad,
            href: "https://kitmu.cl/sobre-kitia/privacidad-y-proteccion-de-datos/"
        },
        {
            title: "No discriminación y equidad",
            blurb:
                "Verificación de diversidad algorítmica, monitoreo de burbujas de filtro comprensibles.",
            img: IMG.equidad,
            href: "https://kitmu.cl/sobre-kitia/no-discriminacion-y-equidad/"
        },
        /*{
            title: "Seguridad y prevención de daños",
            blurb:
                "Etiquetado visible, explicaciones claras, documentación para el público comprensibles.",
            img: IMG.seguridad,
            href: "https://kitmu.cl/sobre-kitia/seguridad-y-prevencion-de-danos/"
        },
        {
            title: "Autonomía humana y control editorial",
            blurb:
                "Supervisión humana para garantizar estándares de profesionalidad.",
            img: IMG.autonomia,
            href: "https://kitmu.cl/sobre-kitia/autonomia-humana-y-control-editorial/"
        },
        {
            title: "Veracidad y lucha contra la desinformación",
            blurb:
                "Fact-checking automatizado, limitación de generación engañosa.",
            img: IMG.veracidad,
            href: "https://kitmu.cl/sobre-kitia/veracidad-y-lucha-contra-la-desinformacion/"
        },
        {
            title: "Pluralismo y diversidad informativa",
            blurb:
                "Auditoría de sesgos, diversidad de datos, revisión ética.",
            img: IMG.pluralismo,
            href: "https://kitmu.cl/sobre-kitia/pluralismo-y-diversidad-informativa/"
        }*/
    ];

    const videos = [
        {
            title: "Runway",
            blurb: "Generación  y edición de videos o imágenes con IA. Crea contenido visual de alta calidad utilizando modelos avanzados de inteligencia artificial.",
            img: IMG.runway,
            href: "https://kitmu.cl/kitia/edicion-videos-kitia/runway/"
        },
        {
            title: "Adobe Podcast",
            blurb: "Transforma audio grabado en contenido de alta calidad con IA. Mejora la claridad, elimina ruidos y optimiza la calidad de tus grabaciones de audio de manera sencilla.",
            img: IMG.adobe,
            href: "https://kitmu.cl/kitia/adobe-podcast/"
        }
    ];

</script>

<div class="page">
    <!-- HEADER -->
    <header class="topbar">
        <a href="/" class="brand" aria-label="KitIA APP">
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
            <a class="pill pill-yellow" href="https://kitmu.cl/sobre-kitia/">Sobre KitIA</a>
            <a class="pill active" href="https://kitmu.cl/sobre-kitia/pilares/">Pilares Éticos</a>
        </nav-->

        <div class="actions">
            <a class="pill pill-yellow" href="https://kitmu.cl/sobre-kitia/" target="_blank">Sobre KitIA</a>
            <a class="pill pill-green" href="https://kitmu.cl/sobre-kitia/pilares/" target="_blank">Pilares Éticos</a>
            <a class="pill active" href="https://kitmu.cl/etapas/generacion-de-contenidos/kitia/" target="_blank">Tutoriales</a>
            <a class="pill pill-lightblue" href="#faq" >Preguntas frecuentes</a>
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
        <!-- HERO: SOBRE KITIA -->
        <section id="bitacora" class="card hero-card">
            <div class="hero-copy ">
                <img src={base + "/img/kitia-cols.svg"} alt="Ilustración KitIA" class="kitia-banner" />

                <h1 style="text-align:center; font-size: 30px">KitIA: tu espacio inteligente para crear con ética y estilo</h1>
                <p class="lead">
                    KitIA es una herramienta pensada especialmente para estudiantes de la FCOM UC que quieren usar IA… pero hacerlo bien. No se trata de “otro ChatGPT más”, sino de un <b>espacio diseñado para ayudarte a pensar cómo usar la IA</b> en tus ramos, proyectos y procesos creativos, considerando los desafíos reales del periodismo, la publicidad y el audiovisual. <a class="read-more-btn" style="color:blue; cursor: pointer" on:click={() => showMore = !showMore}>
                    {showMore ? '' : '[Leer más ...]'}
                </a>
                </p>
                {#if showMore}
                <p class="lead lead-sm">
                    Desarrollado por profes UC y basado en investigación UC, KitIA busca acompañarte en tus decisiones creativas: desde cuando surge una idea hasta cómo la trabajas y la presentas, siempre con criterio, responsabilidad y conciencia ética.
                </p>

                <p class="lead lead-sm">
                    Si usas IA en tus trabajos, que sea con seguridad, claridad y criterio. KitIA no crea por ti: te ayuda a crear mejor, sin miedo y sin enredos.
                </p>
                {/if}


                <a class="btn-white" href={`/app`} target="_blank">comienza  a usar KitIA</a>
            </div>

        </section>

        <section class="kitia-flow">
            <div class="wrapper">
                <h2>KitIA te acompaña a pensar tu proceso creativo:</h2>
                <p class="subtitle">
                    No es solo una herramienta: es un espacio pensado para apoyarte en las decisiones que tomas al usar IA en tu proceso creativo. Desde una idea inicial hasta la entrega de un proyecto, KitIA te ayuda a evaluar, reflexionar y decidir con responsabilidad, sin juzgarte ni limitar tu creatividad.
                </p>

                <div class="steps">
                    <!-- PASO 1 -->
                    <div class="step-card">
                        <div class="icon yellow">
                            💡
                        </div>
                        <span class="step-label">PASO 1</span>
                        <h3>Planificación</h3>
                        <h5 style="margin-top: -10px">Tu punto de partida</h5>
                        <hr />
                        <p>Aquí decides cómo vas a crear y qué tan lejos quieres llegar.
                        </p>
                        <ul>
                            <li>Identifica qué partes de tu proyecto pueden usar IA de forma ética.</li>
                            <li>Define límites claros según tu carrera y las políticas UC.</li>
                            <li>Comienza con un plan simple para documentar tu proceso (KitIA te guía).</li>
                        </ul>
                    </div>

                    <!-- PASO 2 -->
                    <div class="step-card">
                        <div class="icon red">
                            ✒
                        </div>
                        <span class="step-label">PASO 2</span>
                        <h3>Desarrollo</h3>
                        <h5 style="margin-top: -10px">Crea con IA, pero con criterio</h5>
                        <hr />
                        <p>Mientras produces, KitIA está contigo como un copiloto ético.</p>
                        <ul>
                            <li>Te entrega sugerencias según tu disciplina: periodismo, publicidad o audiovisual.</li>
                            <li>Te ayuda a usar IA sin comprometer tu integridad académica.</li>
                            <li>Guarda un registro de uso CONFIDENCIAL, al que sólo tú tienes acceso, para que no tengas que preocuparte después de dónde te quedaste en el proceso.</li>
                        </ul>
                    </div>

                    <!-- PASO 3 -->
                    <div class="step-card">
                        <div class="icon green">
                            🔍
                        </div>
                        <span class="step-label">PASO 3</span>
                        <h3>Revisión de sesgos</h3>
                        <h5 style="margin-top: -10px">Ajusta y afina tu contenido</h5>
                        <hr />
                        <p>Antes de cerrar, puedes revisar si tu trabajo refleja diversidad y justicia.</p>
                        <ul>
                            <li>Detección de sesgos culturales, de género y cognitivos.
                            </li>
                            <li>Apoyo para verificar fuentes y evitar desinformación.</li>
                            <li>Ideas concretas para hacer tu contenido más equilibrado y objetivo.</li>
                        </ul>
                    </div>

                    <!-- PASO 4 -->
                    <div class="step-card">
                        <div class="icon blue">
                            ✓
                        </div>
                        <span class="step-label">PASO 4</span>
                        <h3>Revisión ética final</h3>
                        <h5 style="margin-top: -10px">Tu sello UC</h5>
                        <hr />
                        <p>El último paso para entregar algo que realmente represente lo que quieres comunicar.</p>
                        <ul>
                            <li>Checklist ético final basado en los ocho pilares.</li>
                            <li>Reporte claro y descargable de cómo usaste IA.</li>
                            <li>Validación simple con las políticas UC para que entregues con tranquilidad.</li>
                        </ul>
                    </div>
                </div>

                <!-- EJEMPLO -->
                <div class="example-section">
                    <h4>Ejemplo: Campaña creativa usa generación de imágenes con IA</h4>
                    <p>Sabemos que tienes que trabajar en una propuesta de campaña para una marca local de ropa, usando IA generativa para crear bocetos.</p>

                    <h5>¿Cómo usar KitIA?:</h5>

                    <div class="example-steps">
                        <div class="example-step">
                            <span class="line"></span>
                            <div>
                                <strong>1. PLANIFICACIÓN</strong>
                                <p>
                                    Consulta el pilar "Representación justa" para asegurarte de no reproducir estereotipos en las imágenes generadas.
                                </p>
                                <span class="result">→ Marco teórico claro</span>
                            </div>
                        </div>

                        <div class="example-step">
                            <span class="line"></span>
                            <div>
                                <strong>2. DESARROLLO</strong>
                                <p>
                                    Define tu escenario para el uso de IA junto a KitIA "Voy a usar IA para crear imágenes de modelos humanos con la ropa de la marca. Las características son..."
                                </p>
                                <span class="result">→ KitIA te ayuda a definir límites éticos</span>
                            </div>
                        </div>

                        <div class="example-step">
                            <span class="line"></span>
                            <div>
                                <strong>3. REVISIÓN DESDE LA ÉTICA</strong>
                                <p>
                                    KitIA detecta los posibles riesgos de segos en tus imágenes y te sugiere una lista de preguntas de revisión a través de la herramienta de "Checklist ético" para ayudarte a evaluar si las imágenes generadas son inclusivas y respetuosas.
                                </p>
                                <span class="result">→ Autoevaluas sesgos con una guía práctica</span>
                            </div>
                        </div>

                        <div class="example-step">
                            <span class="line"></span>
                            <div>
                                <strong>4. REVISIÓN FINAL</strong>
                                <p>
                                    Generas reporte de uso ético de IA que puedes actualizar a medida que solucionas las cuestiones planteadas en la revisión ética para documentar todo tu proceso.
                                </p>
                                <span class="result">→ Generas documentación y reflexión crítica</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <section class="kitia-start">
            <div class="kitia-start-wrapper">
                <h2>Comienza a usar IA de forma ética hoy</h2>

                <!-- Video -->
                <div class="video-box">
                    <iframe width="720" height="400"
                            src="https://www.youtube.com/embed/9uB2Jcc3fus?autoplay=1&mute=1&loop=1&playlist=9uB2Jcc3fus"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen></iframe>
                </div>

                <!-- CTA -->
                <a href="/app" class="cta-button">
                    Acceder a KitIA <span>→</span>
                </a>
            </div>
        </section>

        <!-- VIDEOTUTORIALES -->
        <section id="videos" class="videos">
            <h2>Revisa algunos tutoriales para usar las mejores herramientas de IA</h2>
            <p class="vlead">
                ¿Quieres incorporar IA a tus proyectos comunicacionales? Aquí encontrarás videotutoriales donde aprenderás a usar herramientas de IA para potenciar tu creatividad, mejorar tus procesos y experimentar con nuevas formas de producir contenido.
            </p>

            <div class="vgrid">
                {#each videos as v}
                    <article class="vcard">
                        <figure class="vimg">
                            <img src={v.img} alt={v.title} />
                        </figure>

                        <div class="vbody">
                            <h3>{v.title}</h3>
                            <p>{v.blurb}</p>
                            <a class="play-mini" href={v.href} aria-label="Ver video" target="_blank" rel="noopener">
                                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                                    <path d="M8 5v14l11-7Z"/>
                                </svg>
                            </a>
                        </div>
                    </article>
                {/each}
            </div>

            <div class="vmore">
                <a class="btn-white" href="https://kitmu.cl/etapas/generacion-de-contenidos/kitia/" target="_blank">Ver más tutoriales →</a>
            </div>
        </section>

        <!-- PILARES -->
        <section id="pilares" class="tutoriales">
            <h2>KitIA está basado en pilares éticos de estándares internacionales</h2>
            <p class="vlead">
                Estos pilares nacen de una investigación realizada por académicos de la FCOM, que se basa en estándares internacionales adaptados a las necesidades de las carreras de Comunicaciones
            </p>

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
            <div class="vmore">
                <a class="btn-white" href="https://kitmu.cl/sobre-kitia/pilares/" target="_blank">Ver todos los pilares éticos →</a>
            </div>
        </section>

        <section class="kitia-faq" id="faq">
            <div class="faq-wrapper">
                <h2>Preguntas frecuentes</h2>

                <div class="faq-item">
                    <h4>¿KitIA reemplaza a ChatGPT?</h4>
                    <p>
                        Para nada. KitIA no compite con ChatGPT: lo potencia. De hecho, ni siquiera es un bot, sino tu guía para que uses cualquier IA —incluida ChatGPT— de manera ética, inteligente y alineada con lo que pide la FCOM UC.
                    </p>
                </div>

                <hr />

                <div class="faq-item">
                    <h4>¿Es obligatorio usarlo?</h4>
                    <p>
                        No. Nadie te obliga, pero te recomendamos usarla porque te ayuda a evitar errores éticos, mejorar tus entregas y trabajar con IA sin estrés. Es como un copiloto que te hace la vida más fácil… si tú quieres usarlo. Esto no quita que puede ser un recurso docente complementario en algunos cursos.
                    </p>
                </div>

                <hr />

                <div class="faq-item">
                    <h4>¿Tiene costo?</h4>
                    <p>
                        Cero pesos. Es 100% gratuito para cualquier estudiante UC con correo @uc.cl. Lo activas y listo, sin trámites ni suscripciones raras.
                    </p>
                </div>
            </div>
        </section>

        <section class="cards-info">
            <!-- Cards -->
            <div class="benefits">
                <div class="benefit-card">
                    <div class="benefit-icon">🎓</div>
                    <h4>Para estudiantes de Comunicaciones</h4>
                    <p>
                        Diseñado específicamente para el contexto académico UC
                    </p>
                </div>

                <div class="benefit-card">
                    <div class="benefit-icon">🛡️</div>
                    <h4>100% ético</h4>
                    <p>
                        Garantiza integridad en cada paso de tu trabajo
                    </p>
                </div>

                <div class="benefit-card">
                    <div class="benefit-icon">👥</div>
                    <h4>Comunidad activa</h4>
                    <p>
                        Aprende con casos reales de otros estudiantes
                    </p>
                </div>
            </div>
        </section>


    </main>

    <!-- FOOTER opcional con sellos -->
    <footer class="footer">
        <div class="seal">
            <img src={IMG.seal1} alt="Pontificia Universidad Católica de Chile" />
            <div class="links">
                <a href={`https://kitmu.cl/sobre-kitia`} target="_blank">Sobre KitIA</a>
                <a href={`mailto:kitia.app@gmail.com`}>Contacto</a>
                <a href={`https://proyecto-interactiva.github.io/unity-game/`} target="_blank">Eduju</a>
                <a href={`https://kitmovil.com`} target="_blank">Kit móvil</a>
                <a href={`https://kitmu.cl`} target="_blank">Kitmu</a>

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

    .pill-lightblue{
        background: linear-gradient(180deg, #66B2FF, #6dc3ff);
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
        display:grid; grid-template-columns: 1fr;
        gap:0; margin: 1% 15%; margin-top: 28px; padding:0;
        box-shadow: none;
        border: none;
        background: none;
    }
    .hero-copy{
        /*background: #fff;*/
        color:#000; padding: 40px 36px;
        margin: 0 5%;
    }
    .hero-copy h1{ font-size: clamp(23px, 4.2vw, 43px); margin:0 0 12px; text-align: center; }
    .lead{ font-size: clamp(14px, 2vw, 16px); opacity:.95; /*max-width: 52ch;*/ }
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
    .tutoriales{ background: var(--green-100); border-radius: 22px; padding: 5% 10%; }
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

    /* Ajustes sutiles para la nueva copy */
    .hero-copy .lead-sm { opacity: .92; margin-top: 8px; }
    .hero-copy .bullets{
        margin: 14px 0 8px;
        padding-left: 1.1rem;
        line-height: 1.4;
        max-width: 52ch;
        opacity: .95;
    }
    .hero-copy .bullets li{ margin: 6px 0; }
    .kitia-banner {
        width: 100%;
        max-width: 420px;
        display: block;
        margin: 0 auto 20px;
        opacity: 0.95;
    }

    /* --- Sección Cómo funciona (horizontal, limpia) --- */
    .how-horizontal {
        display: grid;
        grid-template-columns: 1fr;
        align-items: center;
        gap: 40px;
        margin: 5% 10%;
        padding: 20px 0;
        background: none;
        box-shadow: none;
        border: none;
    }

    .how-text h2 {
        font-size: clamp(26px, 3.5vw, 42px);
        margin-bottom: 12px;
        color: var(--text);
    }

    .how-text p {
        line-height: 1.6;
        margin: 10px 0 16px;
        /*max-width: 65ch;*/
        color: var(--text);
        opacity: 0.92;
    }

    .how-text h3 {
        margin-top: 22px;
        margin-bottom: 16px;
        font-size: clamp(20px, 2.6vw, 28px);
        color: var(--text);
        font-weight: 800;
    }

    /* Imagen lateral */
    .how-img img {
        width: 100%;
        height: auto;
        object-fit: contain;
        display: block;
    }

    /* Responsive */
    @media (max-width: 900px) {
        .how-horizontal {
            grid-template-columns: 1fr;
            margin: 8% 6%;
        }
        .steps {
            justify-content: center;
            border: none;
        }
    }

    /* --- Videotutoriales --- */
    .videos{
        background: var(--rose-100);
        border-radius: 22px;
        padding: 5% 10%;
    }
    .videos h2{
        color: var(--rose-600);
        font-size: clamp(24px,3.4vw,36px);
        margin: 6px 6px 8px;
    }
    .vlead{
        margin: 6px 6px 20px;
        color: var(--text);
        opacity: .9;
        max-width: 120ch;
        line-height: 1.6;
    }

    .vgrid{
        display: grid;
        gap: 18px;
        grid-template-columns: repeat(2, minmax(0,1fr));
    }

    .vcard{
        background: var(--rose-500);                    /* mismo tono que tcard */
        border-radius: 20px;
        box-shadow: 0 10px 26px rgba(0,0,0,.12);
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .vimg{ margin: 0; background: #e9f6ee; }   /* leve contraste del thumb */
    .vimg img{
        width: 100%;
        height: 220px;
        object-fit: cover;
    }

    .vbody{
        padding: 18px;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 10px;
        align-items: start;
        background: var(--rose-500);
    }
    .vbody h3{
        grid-column: 1 / -1;
        margin: 0 0 6px;
        color: #fff;
        font-size: clamp(18px,2.6vw,24px);
    }
    .vbody p{
        grid-column: 1 / 2;
        margin: 0;
        color: #fff;
        max-width: 44ch;
    }

    .vbody .play-mini svg path{
        fill: var(--rose-500);
    }

    /* Reutiliza .play-mini existente */

    /* Botón centrado */
    .vmore{
        display: grid;
        place-items: center;
        margin-top: 20px;
    }

    .vmore a{
        color: var(--rose-500);
    }

    /* Responsive */
    @media (max-width: 980px){
        .vgrid{ grid-template-columns: 1fr; }
    }

    .kitia-flow {
        padding: 5rem 1rem;
        background: #ffffff;
    }

    .wrapper {
        max-width: 1200px;
        margin: 0 auto;
        text-align: center;
    }

    .kitia-flow h2 {
        font-size: 2.25rem;
        font-weight: 700;
    }

    .subtitle {
        margin: 1rem auto 3.5rem;
        max-width: 720px;
        color: #6b7280;
    }

    .steps {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.75rem;
    }

    .step-card {
        background: linear-gradient(180deg, #f8fafc, #ffffff);
        border: 1px solid #d1d5db;
        border-radius: 20px;
        padding: 2.5rem 1.75rem;
        text-align: center;
    }

    .icon {
        width: 52px;
        height: 52px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
        margin: 0 auto 1rem;
        border: 2px solid currentColor;
    }

    .icon.yellow { color: #f59e0b; }
    .icon.red { color: #ef4444; }
    .icon.green { color: #22c55e; }
    .icon.blue { color: #3b82f6; }

    .step-label {
        font-size: 0.75rem;
        color: #6b7280;
        letter-spacing: 0.08em;
    }

    .step-card h3 {
        margin: 0.5rem 0 1rem;
    }

    .step-card hr {
        border: none;
        border-top: 1px solid #e5e7eb;
        margin-bottom: 1rem;
    }

    .step-card p {
        color: #6b7280;
        font-size: 0.95rem;
    }

    .step-card ul {
        margin-top: 1rem;
        padding-left: 1.2rem;
        text-align: left;
        font-size: 0.9rem;
        color: #374151;
        border-top: 1px solid #e5e7eb;
        padding-top: 1rem;
        list-style-type: disc;
    }

    .step-card ul li {
        margin-bottom: 0.5rem;
        text-align: left;
    }

    .example {
        margin-top: 3.5rem;
        padding: 2rem;
        background: linear-gradient(180deg, #fff7ed, #ffffff);
        border: 1px solid #fed7aa;
        border-radius: 20px;
    }

    .example-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        text-align: left;
    }

    .note {
        margin-top: 2rem;
        font-size: 0.9rem;
        color: #6b7280;
    }

    /* Responsive */
    @media (max-width: 1024px) {
        .steps,
        .example-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 640px) {
        .steps,
        .example-grid {
            grid-template-columns: 1fr;
        }
    }

    /* EJEMPLO */
    .example-section {
        margin-top: 4rem;
        padding: 2.5rem 2rem;
        background: linear-gradient(180deg, #fff7ed, #ffffff);
        border: 1px solid #fed7aa;
        border-radius: 20px;
        text-align: left;
    }

    .example-section h4 {
        margin-bottom: 2rem;
        font-size: 1.2rem;
        font-weight: 600;
    }

    .example-steps {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
    }

    .example-step {
        display: flex;
        gap: 1rem;
        font-size: 0.9rem;
    }

    .example-step .line {
        width: 3px;
        background: #fb923c;
        border-radius: 2px;
    }

    .example-step strong {
        font-size: 0.75rem;
        letter-spacing: 0.06em;
        color: #374151;
    }

    .example-step p {
        margin: 0.4rem 0 0.5rem;
        color: #4b5563;
    }

    .example-step .result {
        font-size: 0.85rem;
        color: #ea580c;
        font-weight: 500;
    }

    /* BLOQUE FINAL */
    .comparison-box {
        margin-top: 2.5rem;
        padding: 1.75rem;
        background: #f9fafb;
        border-radius: 16px;
        text-align: center;
        color: #4b5563;
        font-size: 0.9rem;
    }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
        .example-steps {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 640px) {
        .example-steps {
            grid-template-columns: 1fr;
        }
    }

    .kitia-start {
        background: linear-gradient(180deg, #eceaf6, #f6f5fb);
        padding: 5rem 1rem 6rem;
    }

    .kitia-start-wrapper {
        max-width: 1100px;
        margin: 0 auto;
        text-align: center;
    }

    .kitia-start h2 {
        font-size: 2.2rem;
        font-weight: 700;
        margin-bottom: 2.5rem;
    }

    /* Video */
    .video-box {
        position: relative;
        margin: 0 auto 2.5rem;
        max-width: 720px;
        height: 400px;
        background: linear-gradient(135deg, #0f172a, #1e293b);
        border-radius: 4px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .play-button {
        width: 64px;
        height: 64px;
        border: 3px solid white;
        border-radius: 50%;
        color: white;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .video-label {
        position: absolute;
        bottom: 1.2rem;
        color: #e5e7eb;
        font-size: 0.85rem;
    }

    /* CTA */
    .cta-button {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: white;
        color: #a16207;
        padding: 0.9rem 1.8rem;
        border-radius: 999px;
        font-weight: 600;
        text-decoration: none;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        margin-bottom: 4rem;
    }

    /* Benefits */
    .benefits {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
    }

    .benefit-card {
        background: white;
        border: 2px solid #7c7cf085;
        padding: 2.2rem 1.8rem;
        border-radius: 4px;
        text-align: center;
    }

    .benefit-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
    }

    .benefit-card h4 {
        margin-bottom: 0.6rem;
        font-size: 1rem;
    }

    .benefit-card p {
        font-size: 0.9rem;
        color: #6b7280;
    }

    /* Responsive */
    @media (max-width: 900px) {
        .benefits {
            grid-template-columns: 1fr;
        }

        .video-box {
            height: 280px;
        }
    }

    .kitia-faq {
        background: linear-gradient(180deg, #eceaf6, #f6f5fb);
        padding: 5rem 1rem 6rem;
    }

    .faq-wrapper {
        max-width: 900px;
        margin: 0 auto;
        background: linear-gradient(180deg, #0b2a66, #0a1f4d);
        border-radius: 4px;
        padding: 3rem 3.5rem;
        color: #ffffff;
        box-shadow: 0 20px 50px rgba(0,0,0,0.25);
    }

    .faq-wrapper h2 {
        text-align: center;
        font-size: 1.6rem;
        font-weight: 600;
        margin-bottom: 2.5rem;
    }

    .faq-item h4 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .faq-item p {
        font-size: 0.95rem;
        line-height: 1.6;
        color: #e5e7eb;
    }

    .faq-wrapper hr {
        border: none;
        border-top: 1px solid rgba(255,255,255,0.4);
        margin: 2rem 0;
    }

    /* Responsive */
    @media (max-width: 640px) {
        .faq-wrapper {
            padding: 2.5rem 1.8rem;
        }
        .pill{ font-size: 8px; padding: 8px 12px;}
    }

    .cards-info {
        padding: 4rem 1rem 6rem;
        width: 90%;
        margin: 0 auto;
    }


</style>
