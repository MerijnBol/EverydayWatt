import { months } from './constants';

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

	public getMonthly(): number[] {
		// For now, simple even distribution
		const monthlyConsumption = this._yearlyConsumption / 12;
		return Array(12).fill(monthlyConsumption);

		// Future implementation could use custom monthly distribution if available
	}

	public getDaily(month: string): number[] {
		// Simple even distribution for now
		const monthIndex = months.indexOf(month);
		const daysInMonth = 30; // Simplified; could use actual days per month
		const monthlyConsumption = this._yearlyConsumption / 12;
		const dailyConsumption = monthlyConsumption / daysInMonth;

		return Array(daysInMonth).fill(dailyConsumption);

		// Future implementation could use custom daily patterns if available
	}

	// Clone method for immutability if needed
	public clone(): ConsumptionData {
		return new ConsumptionData(this._yearlyConsumption);
	}
}
