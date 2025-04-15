export enum Month {
	January,
	February,
	March,
	April,
	May,
	June,
	July,
	August,
	September,
	October,
	November,
	December
}

export interface MonthData {
	name: string;
	month: Month;
	daysCount: number;
}

export const monthsData: MonthData[] = [
	{ name: 'January', month: Month.January, daysCount: 31 },
	{ name: 'February', month: Month.February, daysCount: 28 }, // Note: doesn't account for leap years yet
	{ name: 'March', month: Month.March, daysCount: 31 },
	{ name: 'April', month: Month.April, daysCount: 30 },
	{ name: 'May', month: Month.May, daysCount: 31 },
	{ name: 'June', month: Month.June, daysCount: 30 },
	{ name: 'July', month: Month.July, daysCount: 31 },
	{ name: 'August', month: Month.August, daysCount: 31 },
	{ name: 'September', month: Month.September, daysCount: 30 },
	{ name: 'October', month: Month.October, daysCount: 31 },
	{ name: 'November', month: Month.November, daysCount: 30 },
	{ name: 'December', month: Month.December, daysCount: 31 }
];
