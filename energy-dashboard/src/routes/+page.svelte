<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import { writable, get } from 'svelte/store';
	import { months } from '$lib/constants';
	import { getChartData } from '$lib/chartUtils';
	import { ConsumptionData } from '$lib/ConsumptionData';

	let chartEl: HTMLCanvasElement;
	let viewMode: 'month' | 'day' = 'month';
	let selectedMonth = 'January';
	let yearlyConsumption = 3600; // Default yearly in kWh

	// Create a store with our ConsumptionData class
	const consumptionData = writable<ConsumptionData>(new ConsumptionData(yearlyConsumption));

	let chart: Chart;

	// Update energy data when consumption changes
	function updateConsumptionData() {
		consumptionData.update((data) => {
			data.setYearlyConsumption(yearlyConsumption);
			return data;
		});
		updateChart();
	}

	function updateChart() {
		const currentData = get(consumptionData);
		const chartData = getChartData(viewMode, selectedMonth, currentData);
		if (chart) {
			chart.data = chartData;
			chart.update();
		}
	}

	onMount(() => {
		const initialData = get(consumptionData);
		chart = new Chart(chartEl, {
			type: 'line',
			data: getChartData(viewMode, selectedMonth, initialData)
		});
	});
</script>

<main class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Energy Dashboard</h1>

	<section class="space-y-2">
		<label class="block font-semibold">Yearly Consumption (kWh):</label>
		<input
			type="number"
			bind:value={yearlyConsumption}
			class="w-48 rounded border p-2"
			on:change={updateConsumptionData}
		/>
	</section>

	<section class="space-y-2">
		<label class="block font-semibold">Select Month:</label>
		<select bind:value={selectedMonth} class="w-48 rounded border p-2" on:change={updateChart}>
			{#each months as month}
				<option value={month}>{month}</option>
			{/each}
		</select>
	</section>

	<section class="space-y-2">
		<label class="block font-semibold">View Mode:</label>
		<select bind:value={viewMode} class="w-48 rounded border p-2" on:change={updateChart}>
			<option value="month">Monthly View</option>
			<option value="day">Daily View</option>
		</select>
	</section>

	<canvas bind:this={chartEl} width="600" height="300"></canvas>
</main>

<style>
	canvas {
		max-width: 100%;
	}
</style>
