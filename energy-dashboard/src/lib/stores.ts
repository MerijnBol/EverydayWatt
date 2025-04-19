import { writable } from 'svelte/store';
import { ConsumptionData } from './ConsumptionData';

export const consumptionData = writable(new ConsumptionData(0));