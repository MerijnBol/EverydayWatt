<script lang="ts">
	import { get } from 'svelte/store';
	import { graphDataStore } from '$lib';
	import { Intensity, TimeOfDay, type ApplianceProfile } from '$lib/constants';

	const data = get(graphDataStore);
	let yearlyConsumptionInput = data.getYearlyConsumption();
	let applianceProfiles = data.getApplianceProfiles();

	function updateConsumptionData() {
		data.setYearlyConsumption(yearlyConsumptionInput);
		graphDataStore.set(data.clone());
	}

	function toggleApplianceEnabled(profileId: string, enabled: boolean) {
		data.toggleApplianceEnabled(profileId, enabled);
		applianceProfiles = data.getApplianceProfiles();
		graphDataStore.set(data.clone());
	}

	function setApplianceIntensity(profileId: string, intensity: Intensity) {
		data.setApplianceIntensity(profileId, intensity);
		graphDataStore.set(data.clone());
	}

	function toggleTimeOfDay(profileId: string, timeOfDay: TimeOfDay) {
		const profile = applianceProfiles.find(p => p.id === profileId);
		if (!profile) return;

		let newTimeOfDay: TimeOfDay[];
		
		if (profile.timeOfDay.includes(timeOfDay)) {
			// Remove if already included
			newTimeOfDay = profile.timeOfDay.filter(t => t !== timeOfDay);
			// Ensure at least one time of day is selected
			if (newTimeOfDay.length === 0) {
				newTimeOfDay = [timeOfDay];
				return; // Don't update if it would result in empty selection
			}
		} else {
			// Add if not already included
			newTimeOfDay = [...profile.timeOfDay, timeOfDay];
		}

		data.setApplianceTimeOfDay(profileId, newTimeOfDay);
		applianceProfiles = data.getApplianceProfiles();
		graphDataStore.set(data.clone());
	}

	// Helper function to check if a time of day is selected
	function isTimeOfDaySelected(profile: ApplianceProfile, timeOfDay: TimeOfDay): boolean {
		return profile.timeOfDay.includes(timeOfDay);
	}
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
				<div class="border rounded-lg p-3 bg-white shadow-sm">
					<div class="flex items-center justify-between mb-2">
						<h3 class="font-medium">{profile.name}</h3>
						<label class="relative inline-flex items-center cursor-pointer">
							<input 
								type="checkbox" 
								class="sr-only peer"
								checked={profile.enabled}
								on:change={() => toggleApplianceEnabled(profile.id, !profile.enabled)}
							/>
							<div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
						</label>
					</div>

					<div class="mb-3">
						<p class="text-sm mb-1 font-medium">Intensity:</p>
						<div class="flex gap-2">
							{#each Object.values(Intensity) as intensity}
								<button 
									class="px-2 py-1 text-xs rounded-full border {profile.intensity === intensity ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-300'}"
									on:click={() => setApplianceIntensity(profile.id, intensity)}
									disabled={!profile.enabled}
								>
									{intensity.charAt(0).toUpperCase() + intensity.slice(1)}
								</button>
							{/each}
						</div>
					</div>

					<div>
						<p class="text-sm mb-1 font-medium">Time of day:</p>
						<div class="flex flex-wrap gap-2">
							{#each Object.values(TimeOfDay) as timeOfDay}
								<button 
									class="px-2 py-1 text-xs rounded-full border {isTimeOfDaySelected(profile, timeOfDay) ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-300'}"
									on:click={() => toggleTimeOfDay(profile.id, timeOfDay)}
									disabled={!profile.enabled}
								>
									{timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
								</button>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
