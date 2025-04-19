import { type MonthData, monthsData, ConsumptionData } from '$lib';

export function getChartData(
	viewMode: 'year' | 'month' | 'day',
	selectedMonth: MonthData,
	data: ConsumptionData
) {

	if (viewMode === 'year') {
		return {
			labels: monthsData.map((month) => month.name),
			datasets: [
				{
					label: 'Monthly Consumption (kWh)',
					data: data.getYearlyData(),
					borderColor: 'rgb(53, 162, 235)',
					backgroundColor: 'rgba(53, 162, 235, 0.5)',
					tension: 0.1
				}
			]
		};
	}

	if (viewMode === 'day') {
		const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
		return {
			labels: hours,
			datasets: [
				{
					label: 'Hourly Consumption (kWh)',
					data: data.getDailyData(selectedMonth),
					borderColor: 'rgb(75, 192, 192)',
					backgroundColor: 'rgba(75, 192, 192, 0.5)',
					tension: 0.1
				}
			]
		};
	}

	if (viewMode === 'month') {
		const days = Array.from({ length: selectedMonth.daysCount }, (_, i) => `${i + 1}`);
		return {
			labels: days,
			datasets: [
				{
					label: `Daily Consumption (kWh)`,
					data: data.getMonthlyData(selectedMonth),
					borderColor: 'rgb(255, 99, 132)',
					backgroundColor: 'rgba(255, 99, 132, 0.5)',
					tension: 0.1
				}
			]
		};
	}

	// Default case to handle invalid viewMode
    throw new Error(`Invalid viewMode: ${viewMode}`);
}
