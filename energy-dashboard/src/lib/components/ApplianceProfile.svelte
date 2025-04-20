<script lang="ts">
    import { Intensity, TimeOfDay } from '$lib/constants';

    export let profile;
    export let handleUpdate;

    const toggleEnabled = () => {
        profile.enabled = !profile.enabled;
        handleUpdate(profile);
    };
    const setApplianceIntensity = (intensity: Intensity) => {
        profile.intensity = intensity;
        handleUpdate(profile);
    };
    const toggleTimeOfDay = (timeOfDay: TimeOfDay) => {
        const index = profile.timeOfDay.indexOf(timeOfDay);
        if (index > -1) {
            profile.timeOfDay.splice(index, 1);
        } else {
            profile.timeOfDay.push(timeOfDay);
        }
        profile.timeOfDay = [...profile.timeOfDay]; // Reassign to trigger reactivity
        handleUpdate(profile);
    };

    $: intensityOptions = Object.values(Intensity).map(intensity => ({
        value: intensity,
        enabled: profile.intensity === intensity
    }));

    $: timeOfDayOptions = Object.values(TimeOfDay).map(timeOfDay => ({
        value: timeOfDay,
        enabled: profile.timeOfDay.includes(timeOfDay)
    }));
</script>
<div class="border rounded-lg p-3 bg-white shadow-sm">
    <div class="flex items-center justify-between mb-2">
        <h3 class="font-medium">{profile.name}</h3>
        <label class="relative inline-flex items-center cursor-pointer">
            <input 
                type="checkbox" 
                class="sr-only peer"
                checked={profile.enabled}
                on:change={toggleEnabled}
            />
            <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
    </div>
    <div class="mb-3">
        <p class="text-sm mb-1 font-medium">Intensity:</p>
        <div class="flex gap-2">
            {#each intensityOptions as { value, enabled }}
                <button 
                    class="px-2 py-1 text-xs rounded-full border {enabled ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-300'}"
                    on:click={() => setApplianceIntensity(value)}
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
                    on:click={() => toggleTimeOfDay(value)}
                    disabled={!profile.enabled}
                >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </button>
            {/each}
        </div>
    </div>
</div>