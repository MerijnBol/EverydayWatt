import { getContext, setContext } from 'svelte';
import { ConsumptionData } from './domain/ConsumptionData.svelte';

const GRAPH_DATA_KEY = 'consumptionData';


export function getGraphData(): ConsumptionData {
    const data: ConsumptionData = getContext(GRAPH_DATA_KEY);
    if (data) {
        return data;
    }
    throw new Error('Graph data not found');
}

export function createGraphData(): ConsumptionData {
    return setContext(GRAPH_DATA_KEY, new ConsumptionData(3500));
}
