<script lang="ts">
    import { Intensity, TimeOfDay, type ApplianceProfile } from '$lib/constants';

    const {profile = $bindable<ApplianceProfile>()} = $props();

    const diableProfile = () => {
        profile.enabled = false;
    };
    const setApplianceIntensity = (intensity: Intensity) => {
        profile.intensity = intensity;
    };
    const toggleTimeOfDay = (timeOfDay: TimeOfDay) => {
        const index = profile.timeOfDay.indexOf(timeOfDay);
        if (index > -1) {
            profile.timeOfDay.splice(index, 1);
        } else {
            profile.timeOfDay.push(timeOfDay);
        }
        profile.timeOfDay = [...profile.timeOfDay]; // Reassign to trigger reactivity
    };

    const intensityOptions = $derived(Object.values(Intensity).map(intensity => ({
        value: intensity,
        enabled: profile.intensity === intensity
    })));

    const timeOfDayOptions = $derived(Object.values(TimeOfDay).map(timeOfDay => ({
        value: timeOfDay,
        enabled: profile.timeOfDay.includes(timeOfDay)
    })));
</script>

{#if profile.enabled}
<div class="border rounded-lg p-3 bg-white shadow-sm">
    <div class="flex items-center justify-between mb-2">
        <h3 class="font-medium">{profile.name}</h3>
        <label class="relative inline-flex items-center cursor-pointer">
            <button 
                class="text-gray-500"
                onclick={diableProfile}
                aria-label="Disable Profile"
            >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6.5 4a1 1 0 00-.707.293l-.5.5H3a1 1 0 100 2h14a1 1 0 100-2h-2.293l-.5-.5A1 1 0 0013.5 4h-7zM5 8a1 1 0 011-1h8a1 1 0 011 1v8a2 2 0 01-2 2H7a2 2 0 01-2-2V8zm3 2a1 1 0 10-2 0v4a1 1 0 102 0v-4zm4 0a1 1 0 10-2 0v4a1 1 0 102 0v-4z" clip-rule="evenodd" />
            </svg>
            </button>
        </label>
    </div>
    <div class="mb-3">
        <p class="text-sm mb-1 font-medium">Intensity:</p>
        <div class="flex gap-2">
            {#each intensityOptions as { value, enabled }}
                <button 
                    class="px-2 py-1 text-xs rounded-full border {enabled ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-300'}"
                    onclick={() => setApplianceIntensity(value)}
                >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </button>
            {/each}
        </div>
    </div>
    <div>
        <p class="text-sm mb-1 font-medium">Time of day:</p>
        <div class="flex flex-wrap gap-2">
            {#each timeOfDayOptions as { value, enabled }}
                <button 
                    class="px-2 py-1 text-xs rounded-full border {enabled ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-300'}"
                    onclick={() => toggleTimeOfDay(value)}
                    disabled={!profile.enabled}
                >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </button>
            {/each}
        </div>
    </div>
</div>
{/if}