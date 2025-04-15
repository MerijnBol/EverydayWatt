import { monthsData, type MonthData } from './constants';
import { ConsumptionData } from './ConsumptionData';

export function getChartData(
	viewMode: 'month' | 'day',
	selectedMonth: MonthData,
	data: ConsumptionData
) {
	if (viewMode === 'day') {
		const hours = Array.from({ length: 24 }, (_, i) => i + 1);
		return {
			labels: hours,
			datasets: [
				{
					label: 'Consumption (kWh)',
					data: data.getDailyData(selectedMonth),
					borderColor: 'blue',
					backgroundColor: 'lightblue'
				}
			]
		};
	}
	if (viewMode === 'month') {
		const days = Array.from({ length: selectedMonth.daysCount }, (_, i) => `Day ${i + 1}`);
		return {
			labels: days,
			datasets: [
				{
					label: `Consumption in ${selectedMonth.name} (kWh)`,
					data: data.getMonthlyData(selectedMonth),
					borderColor: 'blue',
					backgroundColor: 'lightblue'
				}
			]
		};
	}
}
