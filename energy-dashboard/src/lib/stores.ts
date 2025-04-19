import { writable } from 'svelte/store';
import { ConsumptionData } from './domain/ConsumptionData';

export const consumptionData = writable(new ConsumptionData(0));