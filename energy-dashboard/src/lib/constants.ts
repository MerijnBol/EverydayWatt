export interface MonthData {
	name: string;
	daysCount: number;
}

export const monthsData: MonthData[] = [
	{ name: 'January', daysCount: 31 },
	{ name: 'February', daysCount: 28 }, // Note: doesn't account for leap years yet
	{ name: 'March', daysCount: 31 },
	{ name: 'April', daysCount: 30 },
	{ name: 'May', daysCount: 31 },
	{ name: 'June', daysCount: 30 },
	{ name: 'July', daysCount: 31 },
	{ name: 'August', daysCount: 31 },
	{ name: 'September', daysCount: 30 },
	{ name: 'October', daysCount: 31 },
	{ name: 'November', daysCount: 30 },
	{ name: 'December', daysCount: 31 }
];
