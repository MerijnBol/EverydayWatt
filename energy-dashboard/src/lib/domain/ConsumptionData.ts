import { 
	type MonthData, 
	Month, 
	monthsData, 
	type ApplianceProfile, 
	timeOfDayHours,
	availableApplianceProfiles
} from '../constants';

export class ConsumptionData {
	private _yearlyConsumption: number;
	private _hourlyData: number[][]; // 365 days × 24 hours
	private _applianceProfiles: ApplianceProfile[];
	
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
		this._applianceProfiles = JSON.parse(JSON.stringify(availableApplianceProfiles));
		
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
			
			// Calculate baseline daily consumption (account for appliances taking some percentage)
			const appliancePercentage = 0.4; // Appliances use approximately 40% of total consumption
			const baselinePercentage = 1 - appliancePercentage;
			
			// Base consumption (without appliance-specific usage)
			const baselineDailyAverage = (monthlyConsumption * baselinePercentage) / monthData.daysCount;
			
			// Generate data for each day in the month
			for (let day = 0; day < monthData.daysCount; day++) {
				// Apply small random variations (±10%) for more realistic daily consumption
				const variationFactor = 0.9 + Math.random() * 0.2;
				
				// Apply a weekend pattern (higher on weekends)
				const dayOfWeek = (dayOffset + day) % 7;
				const weekendFactor = dayOfWeek === 5 || dayOfWeek === 6 ? 1.2 : 1.0;
				
				// Total consumption for this day (baseline only)
				const baselineDailyConsumption = baselineDailyAverage * variationFactor * weekendFactor;
				
				// Hourly average for this day (baseline)
				const baselineHourlyAverage = baselineDailyConsumption / 24;
				
				// Initialize hourly consumption with baseline pattern
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
					
					// Store the baseline hourly consumption
					this._hourlyData[dayOffset + day][hour] = baselineHourlyAverage * hourlyFactor;
				}
				
				// Add appliance-specific consumption patterns if enabled
				this.applyApplianceProfiles(dayOffset + day, monthData.month, dayOfWeek, monthlyConsumption * appliancePercentage);
			}
			
			// Update day offset for the next month
			dayOffset += monthData.daysCount;
		}
	}

	private applyApplianceProfiles(dayOfYear: number, month: Month, dayOfWeek: number, monthlyApplianceConsumption: number): void {
		// Get only enabled appliance profiles
		const enabledProfiles = this._applianceProfiles.filter(profile => profile.enabled);
		
		if (enabledProfiles.length === 0) {
			return; // No appliances enabled, exit early
		}
		
		// Calculate a fair share of consumption for each appliance
		const applianceShare = monthlyApplianceConsumption / 30 / enabledProfiles.length;
		
		// For each enabled appliance, apply its consumption pattern
		for (const profile of enabledProfiles) {
			// Get consumption factor based on intensity
			const intensityFactor = profile.consumptionFactors[profile.intensity];
			
			// Calculate appliance consumption for this day
			const applianceConsumption = applianceShare * intensityFactor;
			
			// Seasonal adjustments for heating/cooling
			let seasonalFactor = 1.0;
			if (profile.id === 'heatpump-heating') {
				// More heating in winter months
				seasonalFactor = month < 3 || month > 9 ? 1.8 : (month < 5 || month > 8 ? 0.8 : 0.2);
			} else if (profile.id === 'heatpump-cooling') {
				// More cooling in summer months
				seasonalFactor = month > 4 && month < 9 ? 1.8 : (month > 2 && month < 11 ? 0.6 : 0.1);
			}
			
			// Weekend adjustment (some appliances used more on weekends)
			const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
			let weekendFactor = 1.0;
			if (profile.id === 'washing-machine' || profile.id === 'dishwasher') {
				weekendFactor = isWeekend ? 1.5 : 0.9;
			}
			
			// Total consumption for this appliance on this day
			const dailyApplianceConsumption = applianceConsumption * seasonalFactor * weekendFactor;
			
			// Distribute based on selected times of day
			const selectedHours: number[] = [];
			profile.timeOfDay.forEach(timeOfDay => {
				selectedHours.push(...timeOfDayHours[timeOfDay]);
			});
			
			// Remove duplicates from selectedHours (in case timeOfDay periods overlap)
			const uniqueHours = [...new Set(selectedHours)];
			
			if (uniqueHours.length > 0) {
				// Calculate consumption per hour based on the time slots selected
				const hourlyConsumption = dailyApplianceConsumption / uniqueHours.length;
				
				// Add appliance consumption to the hourly data
				for (const hour of uniqueHours) {
					this._hourlyData[dayOfYear][hour] += hourlyConsumption;
				}
			}
		}
	}

	public setYearlyConsumption(value: number): void {
		this._yearlyConsumption = value;
		this.generateHourlyData();
	}

	public getYearlyConsumption(): number {
		return this._yearlyConsumption;
	}

	public getApplianceProfiles(): ApplianceProfile[] {
		return this._applianceProfiles;
	}

	public updateApplianceProfile(profile: ApplianceProfile): void {
		const index = this._applianceProfiles.findIndex(profile => profile.id === profile.id);
		if (index === -1) {
			this._applianceProfiles.push(profile);
		} else {
			this._applianceProfiles[index] = profile;
		}
		// Regenerate data if yearly consumption is set
		if (this._yearlyConsumption > 0) {
			this.generateHourlyData();
		}
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
		// Deep copy the appliance profiles
		clone._applianceProfiles = JSON.parse(JSON.stringify(this._applianceProfiles));
		return clone;
	}
}
