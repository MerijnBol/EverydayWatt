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

export enum Intensity {
	Low = 'low',
	Average = 'average',
	High = 'high'
}

export enum TimeOfDay {
	Morning = 'morning',
	Midday = 'midday',
	Evening = 'evening',
	Night = 'night'
}

export const timeOfDayHours: Record<TimeOfDay, number[]> = {
	[TimeOfDay.Morning]: [6, 7, 8, 9],
	[TimeOfDay.Midday]: [10, 11, 12, 13, 14, 15],
	[TimeOfDay.Evening]: [16, 17, 18, 19, 20, 21],
	[TimeOfDay.Night]: [22, 23, 0, 1, 2, 3, 4, 5]
};

export interface ApplianceProfile {
	id: string;
	name: string;
	enabled: boolean;
	intensity: Intensity;
	timeOfDay: TimeOfDay[];
	consumptionFactors: {
		[Intensity.Low]: number;
		[Intensity.Average]: number;
		[Intensity.High]: number;
	};
}

export const availableApplianceProfiles: ApplianceProfile[] = [
	{
		id: 'washing-machine',
		name: 'Washing Machine',
		enabled: false,
		intensity: Intensity.Average,
		timeOfDay: [TimeOfDay.Morning],
		consumptionFactors: {
			[Intensity.Low]: 0.5,
			[Intensity.Average]: 0.8,
			[Intensity.High]: 1.2
		}
	},
	{
		id: 'dishwasher',
		name: 'Dishwasher',
		enabled: false,
		intensity: Intensity.Average,
		timeOfDay: [TimeOfDay.Evening],
		consumptionFactors: {
			[Intensity.Low]: 0.4,
			[Intensity.Average]: 0.7,
			[Intensity.High]: 1.0
		}
	},
	{
		id: 'electric-stove',
		name: 'Electric Stove',
		enabled: false,
		intensity: Intensity.Average,
		timeOfDay: [TimeOfDay.Evening],
		consumptionFactors: {
			[Intensity.Low]: 0.8,
			[Intensity.Average]: 1.2,
			[Intensity.High]: 1.8
		}
	},
	{
		id: 'heatpump-heating',
		name: 'Heatpump Heating',
		enabled: false,
		intensity: Intensity.Average,
		timeOfDay: [TimeOfDay.Morning, TimeOfDay.Evening],
		consumptionFactors: {
			[Intensity.Low]: 1.0,
			[Intensity.Average]: 1.5,
			[Intensity.High]: 2.5
		}
	},
	{
		id: 'heatpump-cooling',
		name: 'Heatpump Cooling',
		enabled: false,
		intensity: Intensity.Average,
		timeOfDay: [TimeOfDay.Midday, TimeOfDay.Evening],
		consumptionFactors: {
			[Intensity.Low]: 0.8,
			[Intensity.Average]: 1.2,
			[Intensity.High]: 1.8
		}
	}
];
