<!-- src/routes/(app)/+layout.svelte -->
<script lang="ts">
    async function logout(){
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
    }
</script>

<header class="header">
    <div class="header-inner">
        <strong>Bitácora RAG</strong>
        <nav class="nav">
            <a href="/">Bitácoras</a>
            <a href="/rag">Buscar (RAG)</a>
            <a href="/audit">Auditoría</a>
            <button class="button" on:click={logout}>Salir</button>
        </nav>
    </div>
</header>
<main class="container"><slot /></main>
