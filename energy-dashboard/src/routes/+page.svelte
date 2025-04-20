<script lang="ts">
	import { get } from 'svelte/store';
	import { graphDataStore } from '$lib';
	import Appliance from '$lib/components/ApplianceProfile.svelte';
	import { type ApplianceProfile, availableApplianceProfiles } from '$lib/constants';

	const data = get(graphDataStore);
	let yearlyConsumptionInput = data.getYearlyConsumption();
	let applianceProfiles = data.getApplianceProfiles();

	data.updateApplianceProfile(availableApplianceProfiles[0])
	
	function updateConsumptionData() {
		data.setYearlyConsumption(yearlyConsumptionInput);
		graphDataStore.set(data.clone());
	}

	const handleProfileUpdate = (profile: ApplianceProfile) => {
		console.log(profile)
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
</section>
