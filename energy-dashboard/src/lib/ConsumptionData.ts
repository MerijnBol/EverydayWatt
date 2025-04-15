import { type MonthData } from './constants';

export class ConsumptionData {
	private _yearlyConsumption: number;

	constructor(yearlyConsumption: number = 0) {
		this._yearlyConsumption = yearlyConsumption;
	}

	public setYearlyConsumption(value: number): void {
		this._yearlyConsumption = value;
	}

	public getYearlyConsumption(): number {
		return this._yearlyConsumption;
	}

	public getMonthlyData(month: MonthData): number[] {
		const daysInMonth = month.daysCount;

		// Calculate daily consumption
		const monthlyConsumption = this._yearlyConsumption / 12;
		const dailyConsumption = monthlyConsumption / daysInMonth;

		// Return an array with the correct number of days
		return Array(daysInMonth).fill(dailyConsumption);
	}

	public getDailyData(month: MonthData): number[] {
		// For now, simple even distribution
		const monthlyConsumption = this._yearlyConsumption / 24;
		return Array(24).fill(monthlyConsumption);
	}

	// Clone method for immutability if needed
	public clone(): ConsumptionData {
		return new ConsumptionData(this._yearlyConsumption);
	}
}
