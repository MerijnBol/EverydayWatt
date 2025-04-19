<script lang="ts">
	import { get } from 'svelte/store';
	import { consumptionData } from '$lib/stores';

	const data = get(consumptionData);
	let yearlyConsumptionInput = data.getYearlyConsumption();

	function updateConsumptionData() {
		data.setYearlyConsumption(yearlyConsumptionInput);
		consumptionData.set(data.clone());
	};
</script>

<section class="flex flex-wrap items-center gap-4 rounded-xl bg-gray-50 p-4 shadow-sm">
	<div class="flex flex-col text-sm">
		<label for="yearly-consumption" class="mb-1 font-medium">Yearly kWh</label>
		<input
			id="yearly-consumption"
			type="number"
			bind:value={yearlyConsumptionInput}
			class="w-28 rounded border border-gray-300 p-1"
			on:change={updateConsumptionData}
		/>
	</div>
</section>
