<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import { writable, get } from 'svelte/store';
	import { monthsData, type MonthData } from '$lib/constants';
	import { getChartData } from '$lib/chartUtils';
	import { ConsumptionData } from '$lib/ConsumptionData';

	let chartEl: HTMLCanvasElement;
	let viewMode: 'year' | 'month' | 'day' = 'month';
	let selectedMonth: MonthData = monthsData[0];
	let yearlyConsumption = 3600;

	const consumptionData = writable<ConsumptionData>(new ConsumptionData(yearlyConsumption));

	let chart: Chart;

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
			data: getChartData(viewMode, selectedMonth, initialData),
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						beginAtZero: true
					}
				}
			}
		});
	});
</script>

<main class="flex min-h-screen flex-col gap-6 overflow-hidden bg-white p-4">
	<h1 class="text-3xl font-bold text-gray-800">Energy Dashboard</h1>

	<section class="flex flex-wrap items-center gap-4 rounded-xl bg-gray-50 p-4 shadow-sm">
		<div class="flex flex-col text-sm">
			<label for="yearly-consumption" class="mb-1 font-medium">Yearly kWh</label>
			<input
				id="yearly-consumption"
				type="number"
				bind:value={yearlyConsumption}
				class="w-28 rounded border border-gray-300 p-1"
				on:change={updateConsumptionData}
			/>
		</div>

		<div class="flex flex-col text-sm">
			<span class="mb-1 font-medium">View</span>
			<div class="flex gap-2">
				<button
					class="rounded-full border px-3 py-1 text-sm transition-all
							{viewMode === 'year' ? 'bg-blue-600 text-white' : 'border-gray-300 bg-white'}"
					on:click={() => {
						viewMode = 'year';
						updateChart();
					}}
				>
					Year
				</button>
				<button
					class="rounded-full border px-3 py-1 text-sm transition-all
							{viewMode === 'month' ? 'bg-blue-600 text-white' : 'border-gray-300 bg-white'}"
					on:click={() => {
						viewMode = 'month';
						updateChart();
					}}
				>
					Month
				</button>
				<button
					class="rounded-full border px-3 py-1 text-sm transition-all
							{viewMode === 'day' ? 'bg-blue-600 text-white' : 'border-gray-300 bg-white'}"
					on:click={() => {
						viewMode = 'day';
						updateChart();
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
					on:change={updateChart}
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
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: system-ui, sans-serif;
		background: #f9fafb;
	}
</style>
