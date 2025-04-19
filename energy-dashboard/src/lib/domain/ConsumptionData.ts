import { type MonthData, Month, monthsData } from '../constants';

export class ConsumptionData {
	private _yearlyConsumption: number;
	private _hourlyData: number[][]; // 365 days × 24 hours
	
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
		this._hourlyData = this.createEmptyHourlyData();
		if (yearlyConsumption > 0) {
			this.generateHourlyData();
		}
	}

	private createEmptyHourlyData(): number[][] {
		// Create a 365x24 array initialized with zeros
		return Array.from({ length: 365 }, () => Array(24).fill(0));
	}

	private getDayOfYear(month: Month, day: number): number {
		// Get the day of the year (0-364) based on month and day
		let dayOfYear = day - 1; // Convert 1-based day to 0-based index
		
		// Add days from previous months
		for (let m = 0; m < month; m++) {
			dayOfYear += monthsData[m].daysCount;
		}
		
		return dayOfYear;
	}

	private generateHourlyData(): void {
		// Initialize with zeros
		this._hourlyData = this.createEmptyHourlyData();
		
		// Store current day offset within the year
		let dayOffset = 0;
		
		// Process each month
		for (const monthData of monthsData) {
			// Calculate what portion of yearly consumption this month should take
			const normalizedWeight = this._monthlyWeights[monthData.month] / this._totalWeight;
			const monthlyConsumption = this._yearlyConsumption * normalizedWeight;
			
			// Calculate baseline daily consumption
			const dailyAverage = monthlyConsumption / monthData.daysCount;
			
			// Generate data for each day in the month
			for (let day = 0; day < monthData.daysCount; day++) {
				// Apply small random variations (±10%) for more realistic daily consumption
				const variationFactor = 0.9 + Math.random() * 0.2;
				
				// Apply a weekend pattern (higher on weekends)
				const dayOfWeek = (dayOffset + day) % 7;
				const weekendFactor = dayOfWeek === 5 || dayOfWeek === 6 ? 1.2 : 1.0;
				
				// Total consumption for this day
				const dailyConsumption = dailyAverage * variationFactor * weekendFactor;
				
				// Hourly average for this day
				const hourlyAverage = dailyConsumption / 24;
				
				// Generate hourly data for this day
				for (let hour = 0; hour < 24; hour++) {
					// Create a usage pattern: lower at night (10pm-6am), higher during day with peaks in morning and evening
					let hourlyFactor = 1.0;
					
					if (hour >= 22 || hour < 6) {
						hourlyFactor = 0.6; // Night hours - lower usage
					} else if (hour >= 6 && hour < 9) {
						hourlyFactor = 1.4; // Morning peak
					} else if (hour >= 17 && hour < 20) {
						hourlyFactor = 1.5; // Evening peak
					}
					
					// Store the hourly consumption
					this._hourlyData[dayOffset + day][hour] = hourlyAverage * hourlyFactor;
				}
			}
			
			// Update day offset for the next month
			dayOffset += monthData.daysCount;
		}
	}

	public setYearlyConsumption(value: number): void {
		this._yearlyConsumption = value;
		this.generateHourlyData();
	}

	public getYearlyConsumption(): number {
		return this._yearlyConsumption;
	}

	// Get yearly data showing consumption for each month
	public getYearlyData(): number[] {
		// Return the total consumption for each month
		const monthlyTotals: number[] = [];
		
		let dayOffset = 0;
		for (const monthData of monthsData) {
			let monthlyTotal = 0;
			
			// Sum all hourly values for this month
			for (let day = 0; day < monthData.daysCount; day++) {
				for (let hour = 0; hour < 24; hour++) {
					monthlyTotal += this._hourlyData[dayOffset + day][hour];
				}
			}
			
			monthlyTotals.push(monthlyTotal);
			dayOffset += monthData.daysCount;
		}
		
		return monthlyTotals;
	}

	// Get hourly data for a specific day of a month
	public getDailyData(month: MonthData): number[] {
		// Get the first day of the month in the year
		const dayOfYear = this.getDayOfYear(month.month, 1);
		
		// Return hourly data for the first day of the month (could be configurable in future)
		return [...this._hourlyData[dayOfYear]];
	}

	// Get daily data for a month
	public getMonthlyData(month: MonthData): number[] {
		// Get the first day of the month in the year
		const firstDayOfMonth = this.getDayOfYear(month.month, 1);
		
		// Calculate daily totals for the month
		return Array.from({ length: month.daysCount }, (_, day) => {
			const dayOfYear = firstDayOfMonth + day;
			// Sum all hourly values for this day
			return this._hourlyData[dayOfYear].reduce((sum, hourValue) => sum + hourValue, 0);
		});
	}

	// Clone method for immutability if needed
	public clone(): ConsumptionData {
		const clone = new ConsumptionData(this._yearlyConsumption);
		// Deep copy the hourly data array
		clone._hourlyData = JSON.parse(JSON.stringify(this._hourlyData));
		return clone;
	}
}
