<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
    import { get } from 'svelte/store';
	import { monthsData, type MonthData, graphDataStore } from '$lib';
	import { getChartData } from './chartUtils';


	let chartEl: HTMLCanvasElement;
	let viewMode: 'year' | 'month' | 'day' = 'month';
	let selectedMonth: MonthData = monthsData[0];
	let chart: Chart;


	function drawChart() {
        const data = get(graphDataStore); // Access the store value
        const chartData = getChartData(viewMode, selectedMonth, data);
		if (!chart) {
			chart = new Chart(chartEl, {
				type: 'line',
				data: chartData,
				options: {
					responsive: true,
					maintainAspectRatio: false,
					animation: {
						duration: 0 // Disable initial animation
					},
					scales: {
						y: {
							beginAtZero: true
						}
					}
				}
            });
        } else {
            chart.data = chartData;
            chart.update();
        }
    }

    onMount(() => {
        drawChart();
    });
</script>

<section class="flex flex-wrap items-center gap-4 rounded-xl bg-gray-50 p-4 shadow-sm">
	<div class="flex flex-col text-sm">
		<span class="mb-1 font-medium">View</span>
		<div class="flex gap-2">
			<button
				class="rounded-full border px-3 py-1 text-sm transition-all
						{viewMode === 'year' ? 'bg-blue-600 text-white' : 'border-gray-300 bg-white'}"
				on:click={() => {
					viewMode = 'year';
					drawChart();
				}}
			>
				Year
			</button>
			<button
				class="rounded-full border px-3 py-1 text-sm transition-all
						{viewMode === 'month' ? 'bg-blue-600 text-white' : 'border-gray-300 bg-white'}"
				on:click={() => {
					viewMode = 'month';
					drawChart();
				}}
			>
				Month
			</button>
			<button
				class="rounded-full border px-3 py-1 text-sm transition-all
						{viewMode === 'day' ? 'bg-blue-600 text-white' : 'border-gray-300 bg-white'}"
				on:click={() => {
					viewMode = 'day';
					drawChart();
				}}
			>
				Day
			</button>
		</div>
	</div>

	{#if viewMode !== 'year'}
		<div class="flex flex-col text-sm">
			<label for="month-select" class="mb-1 font-medium">Month</label>
			<select
				id="month-select"
				bind:value={selectedMonth}
				class="w-32 rounded border border-gray-300 p-1"
				on:change={drawChart}
			>
				{#each monthsData as month}
					<option value={month}>{month.name}</option>
				{/each}
			</select>
		</div>
	{/if}
</section>

<div class="relative flex-1">
	<canvas bind:this={chartEl} class="absolute inset-0 h-full w-full"></canvas>
</div>
