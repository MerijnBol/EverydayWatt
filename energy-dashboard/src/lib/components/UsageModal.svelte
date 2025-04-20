<script lang="ts">
	import { type ApplianceProfile } from '$lib/constants';

	export let applianceProfiles: ApplianceProfile[];
    export let handleUpdate: (profile: ApplianceProfile) => void;
    export let closeModal: () => void;

	function toggleProfile(profile: ApplianceProfile) {
        handleUpdate(profile);
	}
</script>

<div class="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
	<div class="bg-white p-6 rounded shadow-lg w-96">
		<h2 class="text-lg font-medium mb-4">Set Up Usage</h2>
		<ul>
			{#each applianceProfiles as profile}
				<li class="flex justify-between items-center mb-2">
					<span>{profile.name}</span>
					<label class="flex items-center">
						<input type="checkbox" bind:checked={profile.enabled} on:change={() => toggleProfile(profile)} />
						<span class="ml-2">Enabled</span>
					</label>
				</li>
			{/each}
		</ul>
		<button class="mt-4 px-4 py-2 bg-red-500 text-white rounded" on:click={closeModal}>
			Close
		</button>
	</div>
</div>