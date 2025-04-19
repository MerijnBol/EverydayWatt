import { writable } from 'svelte/store';
import { ConsumptionData } from './domain/ConsumptionData';

// Initialize with 3500 kWh as a default yearly consumption value
export const consumptionData = writable(new ConsumptionData(3500));