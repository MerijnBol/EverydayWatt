<script lang="ts">
    import '../app.css';
	import { page } from '$app/state';

    let { children } = $props();
</script>

<main class="flex min-h-screen flex-col gap-6 overflow-hidden bg-white p-4">
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-semibold text-gray-800">Energy Dashboard</h1>
		<nav class="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4 text-sm text-gray-600">
            <a 
                href="/" 
                class="hover:underline {page.url.pathname === '/' ? 'text-blue-500 font-bold' : ''}"
            >
                Home
            </a>
            <span>|</span>
            <a 
                href="/graph" 
                class="hover:underline {page.url.pathname === '/graph' ? 'text-blue-500 font-bold' : ''}"
            >
                Graph
            </a>
        </nav>
	</div>
    {@render children()}
</main>