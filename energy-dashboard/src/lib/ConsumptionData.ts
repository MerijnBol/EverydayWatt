import { type MonthData, Month } from './constants';

export class ConsumptionData {
	private _yearlyConsumption: number;

	// Hidden monthly usage weightings (not configurable externally)
	// These numbers represent the relative energy consumption in each month
	// Higher values = more consumption in that month
	private readonly _monthlyWeights: Record<Month, number> = {
		[Month.January]: 1.4, // Winter - high heating usage
		[Month.February]: 1.3, // Winter - high heating usage
		[Month.March]: 1.1, // Early spring - moderate heating
		[Month.April]: 0.9, // Spring - less heating needed
		[Month.May]: 0.8, // Late spring - minimal heating
		[Month.June]: 0.7, // Early summer - no heating
		[Month.July]: 0.8, // Mid summer - some cooling/AC
		[Month.August]: 0.9, // Late summer - more cooling/AC
		[Month.September]: 0.8, // Early fall - minimal heating
		[Month.October]: 0.9, // Fall - some heating
		[Month.November]: 1.1, // Late fall - more heating
		[Month.December]: 1.3 // Winter - high heating usage
	};

	// Calculate the total weight for normalization
	private readonly _totalWeight = Object.values(this._monthlyWeights).reduce(
		(sum, weight) => sum + weight,
		0
	);

	constructor(yearlyConsumption: number = 0) {
		this._yearlyConsumption = yearlyConsumption;
	}

	public setYearlyConsumption(value: number): void {
		this._yearlyConsumption = value;
	}

	public getYearlyConsumption(): number {
		return this._yearlyConsumption;
	}

	// Get the weighted consumption for a specific month
	private getWeightedMonthlyConsumption(month: Month): number {
		// Calculate what portion of yearly consumption this month should take
		const normalizedWeight = this._monthlyWeights[month] / this._totalWeight;
		return this._yearlyConsumption * normalizedWeight;
	}

	// Get hourly data for a month (previously getDailyData)
	public getDailyData(month: MonthData): number[] {
		// Apply monthly weighting to daily consumption
		const monthlyConsumption = this.getWeightedMonthlyConsumption(month.month);

		// Divide by 24 hours
		const hourlyAverage = monthlyConsumption / (month.daysCount * 24);

		// Simple pattern: slightly lower at night, higher during day
		return Array.from({ length: 24 }, (_, hour) => {
			// Create a usage pattern: lower at night (10pm-6am), higher during day with peaks in morning and evening
			let hourlyFactor = 1.0;

			if (hour >= 22 || hour < 6) {
				hourlyFactor = 0.6; // Night hours - lower usage
			} else if (hour >= 6 && hour < 9) {
				hourlyFactor = 1.4; // Morning peak
			} else if (hour >= 17 && hour < 20) {
				hourlyFactor = 1.5; // Evening peak
			}

			return hourlyAverage * hourlyFactor;
		});
	}

	// Get daily data for a month (previously getMonthlyData)
	public getMonthlyData(month: MonthData): number[] {
		// Get weighted monthly consumption
		const monthlyConsumption = this.getWeightedMonthlyConsumption(month.month);

		// Calculate baseline daily consumption
		const dailyAverage = monthlyConsumption / month.daysCount;

		// Return daily values with slight variations for more realistic data
		return Array.from({ length: month.daysCount }, (_, dayIndex) => {
			// Apply small random variations (±10%) for more realistic consumption
			const variationFactor = 0.9 + Math.random() * 0.2;

			// Apply a weekend pattern (higher on weekends)
			const dayOfWeek = dayIndex % 7;
			const weekendFactor = dayOfWeek === 5 || dayOfWeek === 6 ? 1.2 : 1.0;

			return dailyAverage * variationFactor * weekendFactor;
		});
	}

	// Clone method for immutability if needed
	public clone(): ConsumptionData {
		return new ConsumptionData(this._yearlyConsumption);
	}
}
