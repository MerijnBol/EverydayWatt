import { months } from './constants';
import { ConsumptionData } from './ConsumptionData';

export function getChartData(
	viewMode: 'month' | 'day',
	selectedMonth: string,
	data: ConsumptionData
) {
	if (viewMode === 'month') {
		return {
			labels: months,
			datasets: [
				{
					label: 'Consumption (kWh)',
					data: data.getMonthly(),
					borderColor: 'blue',
					backgroundColor: 'lightblue'
				}
			]
		};
	} else {
		const days = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
		return {
			labels: days,
			datasets: [
				{
					label: `Consumption in ${selectedMonth} (kWh)`,
					data: data.getDaily(selectedMonth),
					borderColor: 'blue',
					backgroundColor: 'lightblue'
				}
			]
		};
	}
}
