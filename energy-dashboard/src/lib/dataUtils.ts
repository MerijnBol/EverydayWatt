import { months } from './constants';
import type { EnergyData } from './models';

export function createEnergyData(yearlyConsumption: number): EnergyData {
	return {
		yearlyConsumption
		// Add more fields here as needed
	};
}

export function getMonthlyData(data: EnergyData): number[] {
	// For now, simple even distribution
	const monthlyConsumption = data.yearlyConsumption / 12;
	return Array(12).fill(monthlyConsumption);

	// Future implementation could use custom monthly distribution if available:
	// if (data.monthlyDistribution) {
	//   return months.map(month => data.monthlyDistribution[month] || monthlyConsumption);
	// }
}

export function getDailyData(data: EnergyData, month: string): number[] {
	// Simple even distribution for now
	const monthIndex = months.indexOf(month);
	const daysInMonth = 30; // Simplified; could use actual days per month
	const monthlyConsumption = data.yearlyConsumption / 12;
	const dailyConsumption = monthlyConsumption / daysInMonth;

	return Array(daysInMonth).fill(dailyConsumption);

	// Future implementation could use custom daily patterns if available
}

export function getChartData(viewMode: 'month' | 'day', selectedMonth: string, data: EnergyData) {
	if (viewMode === 'month') {
		return {
			labels: months,
			datasets: [
				{
					label: 'Consumption (kWh)',
					data: getMonthlyData(data),
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
					data: getDailyData(data, selectedMonth),
					borderColor: 'blue',
					backgroundColor: 'lightblue'
				}
			]
		};
	}
}
