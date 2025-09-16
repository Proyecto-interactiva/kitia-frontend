<!-- src/routes/(app)/+layout.svelte -->
<script lang="ts">
    import { base } from '$app/paths';
    async function logout(){
        await fetch(`${base}/api/auth/logout`, { method: 'POST' });
        window.location.href = `${base}/login`;
    }
</script>

<header class="header">
    <div class="header-inner">
        <strong>Bitácora RAG</strong>
        <nav class="nav">
            <a href="{base}/inicio">Inicio</a>
            <a href="{base}/evaluaciones">Evaluaciones</a>
            <button class="button" on:click={logout}>Salir</button>
        </nav>
    </div>
</header>
<main class="container"><slot /></main>
