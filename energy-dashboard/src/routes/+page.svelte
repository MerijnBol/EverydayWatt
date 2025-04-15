<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  let chartEl: HTMLCanvasElement;

  onMount(() => {
    const chart = new Chart(chartEl, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [
          {
            label: 'Consumption (kWh)',
            data: [300, 280, 350, 400],
            borderColor: 'blue',
            backgroundColor: 'lightblue',
          },
          {
            label: 'Production (kWh)',
            data: [100, 120, 200, 250],
            borderColor: 'green',
            backgroundColor: 'lightgreen',
          },
        ]
      },
    });

    return () => chart.destroy();
  });
</script>

<main class="p-4">
  <h1 class="text-2xl font-bold mb-4">Energy Dashboard</h1>
  <canvas bind:this={chartEl} width="400" height="200"></canvas>
</main>

<style>
  canvas {
    max-width: 100%;
  }
</style>
