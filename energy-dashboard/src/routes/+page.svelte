<script lang="ts">
	import { get } from 'svelte/store';
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import { graphDataStore } from '$lib';
	import { type ApplianceProfile } from '$lib/constants';
	import Appliance from '$lib/components/ApplianceProfile.svelte';
	import UsageModal from '$lib/components/UsageModal.svelte';

	const data = get(graphDataStore);
	let yearlyConsumptionInput = data.getYearlyConsumption();
	$: applianceProfiles = data.getApplianceProfiles();

	function showModal() {
		pushState('', {
			showModal: true
		});
	}

	function updateConsumptionData() {
		data.setYearlyConsumption(yearlyConsumptionInput);
		graphDataStore.set(data.clone());
	}

	const handleProfileUpdate = (profile: ApplianceProfile) => {
		console.log(profile);
		data.updateApplianceProfile(profile);
		graphDataStore.set(data.clone());
	};
</script>

<section class="flex flex-wrap gap-4 rounded-xl bg-gray-50 p-4 shadow-sm">
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

	<div class="w-full mt-4">
		<h2 class="text-lg font-medium mb-3">Appliance Profiles</h2>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each applianceProfiles as profile}
				<Appliance {profile} handleUpdate={handleProfileUpdate} />
			{/each}
		</div>
	</div>

	<button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded" on:click={showModal}>
		Set Up Usage
	</button>

	{#if page.state.showModal}
		<UsageModal {applianceProfiles} handleUpdate={handleProfileUpdate} closeModal={() => history.back()}/>
	{/if}
</section>
