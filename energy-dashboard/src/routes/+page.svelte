<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import { getGraphData } from '$lib';
	import Appliance from '$lib/components/ApplianceProfile.svelte';
	import UsageModal from '$lib/components/UsageModal.svelte';

	const graphData = getGraphData();
	const yearlyConsumptionInput = $derived(graphData.getYearlyConsumption());
	const applianceProfiles = $derived(graphData.getApplianceProfiles());

	function showModal() {
		pushState('', {
			showModal: true
		});
	}
	function setConsumption(event: Event) {
		const value = parseInt((event.target as HTMLInputElement).value);
		graphData.setYearlyConsumption(value);
	}
</script>

<section class="flex flex-wrap gap-4 rounded-xl bg-gray-50 p-4 shadow-sm">
	<div class="flex flex-col text-sm">
		<label for="yearly-consumption" class="mb-1 font-medium">Yearly kWh</label>
		<input
			id="yearly-consumption"
			type="number"
			value={yearlyConsumptionInput}
			class="w-28 rounded border border-gray-300 p-1"
			onchange={setConsumption}
		/>
	</div>

	<div class="w-full mt-4">
		{#if applianceProfiles.filter(p => p.enabled).length > 0}
		<h2 class="text-lg font-medium mb-3">Appliance Profiles</h2>
		{/if}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each applianceProfiles as profile, i}
				 <Appliance bind:profile={applianceProfiles[i]} />
			{/each}
		</div>
	</div>

	<button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onclick={showModal}>
		Set Up Usage
	</button>

	{#if page.state.showModal}
		<UsageModal {applianceProfiles} handleUpdate={graphData.updateApplianceProfile} closeModal={() => history.back()}/>
	{/if}
</section>
