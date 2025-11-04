<!-- src/routes/(app)/tutor/+page.svelte -->
<script lang="ts">
    import { base } from '$app/paths';
    import {onMount} from "svelte";
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

    let choice: 'new' | 'history' | null = null;

    function go(path: string) {
        window.location.href = `${base}${path}`;
    }

    function start() {
        if (choice === 'new') go('/evaluaciones/nueva');
        else if (choice === 'history') go('/evaluaciones');
    }

    function handleSelect(val: 'new' | 'history') {
        choice = val;
        start(); // navega de inmediato al hacer click
    }

    // Accesibilidad con teclado
    function selectAndFocus(val: 'new' | 'history', e: KeyboardEvent) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect(val);
        }
    }
</script>

<section class="intro">
    <h1>¿En qué te puedo ayudar?</h1>

    <div class="cards" role="radiogroup" aria-label="Opciones de inicio">
        <!-- TARJETA: Nueva evaluación -->
        <article
                class="choice"
                role="radio"
                tabindex="0"
                aria-checked={choice === 'new'}
                on:click={() => handleSelect('new')}
                on:keydown={(e) => selectAndFocus('new', e)}
        >
            <div class="icon" aria-hidden="true">
                <!-- Robot -->
                <div class="icon" aria-hidden="true">
                    <!-- Robot -->
                    <img src="{`${base}/img/robot01.svg`}" alt="Robot tutor" width="154" height="154" style="border-radius: 8px;" />
                </div>
            </div>

            <div class="body">
                <h3>Empezar una nueva evaluación ética</h3>
                <p>Comienza una evaluación ética desde cero y continúa tu progreso.</p>
            </div>
        </article>

        <!-- TARJETA: Historial -->
        <article
                class="choice"
                role="radio"
                tabindex="0"
                aria-checked={choice === 'history'}
                on:click={() => handleSelect('history')}
                on:keydown={(e) => selectAndFocus('history', e)}
        >
            <div class="icon" aria-hidden="true">
                <!-- Robot -->
                <img src="{`${base}/img/robot02.svg`}" alt="Robot tutor" width="154" height="154" style="border-radius: 8px;" />
            </div>

            <div class="body">
                <h3>Ver evaluaciones anteriores</h3>
                <p>Accede a tus evaluaciones éticas previas y continúa tu progreso.</p>
            </div>
        </article>
    </div>
</section>

<style>
    :root {
        /* tonos del mock */
        --cream: #f8efd8;
        --ink: #2b2b2b;
        --muted: #6b7280;
        --card: #ffffff;
        --line: #e9e5dc;

        --accent: #e9bf3c;     /* amarillo de íconos */
        --accent-bg: #fff5d6;  /* fondo suave del ícono */

        --radius: 22px;
        --shadow: 0 16px 40px rgba(0,0,0,.12);
        --ring: 0 0 0 6px rgba(233,191,60,.18);
    }

    .intro {
        border-radius: 0; /* el contenedor ya viene del layout */
        padding: clamp(12px, 3.6vw, 28px);
    }

    .intro h1{
        font-weight: 800;
        text-align: center;
        color: var(--ink);
        font-size: clamp(26px, 4.6vw, 48px);
        margin: 18px 0 28px;
        letter-spacing: .3px;
    }

    .cards{
        max-width: 1120px;
        margin: 0 auto;
        display: grid;
        gap: clamp(16px, 2vw, 26px);
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .choice{
        display: grid;
        grid-template-rows: auto 1fr;
        gap: 16px;
        background: var(--card);
        border: 1px solid var(--line);
        border-radius: 26px;
        padding: clamp(16px, 3.2vw, 28px);
        box-shadow: var(--shadow);
        cursor: pointer;
        transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
        outline: none;
        align-content: center;
        text-align: center;
    }
    .choice:hover{ transform: translateY(-2px); }
    .choice[aria-checked="true"]{ box-shadow: var(--shadow), var(--ring); border-color: #f0d88a; }

    .icon{
        position: relative;
        border-radius: 18px;
        color: var(--accent);
        display: grid; place-items: center;
        margin: 8px auto 4px; /* centrado arriba */
    }
    .icon .doc, .icon .bubbles{
        position: absolute; right: -6px; top: -6px;
        background: var(--card);
        border-radius: 10px;
        padding: 2px;
        box-shadow: 0 6px 14px rgba(0,0,0,.08);
    }

    .body{ padding: 0 10%; }
    .choice h3{
        margin: 0 0 8px;
        font-weight: 800;
        color: #343a40;
        font-size: clamp(18px, 2.6vw, 28px);
    }
    .choice p{
        margin: 0;
        color: var(--muted);
        font-size: clamp(14px, 1.9vw, 16px);
        line-height: 1.55;
    }

    @media (max-width: 900px){
        .cards{ grid-template-columns: 1fr; }
        .body{ max-width: unset; }
    }
</style>
