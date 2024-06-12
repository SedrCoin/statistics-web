export interface IWSLog {
	id: number;
	symbol: string;
	priceChanged: string;
	time: string;
	diff: string;
	interval: number;
}

export enum RangeIntervalsEnum {
	FIFTEEN_MINS = '15min',
	THIRTY_MINS = '30min',
	ONE_HOUR = '1hr',
	SIX_HOUR = '6hrs',
	TWELVE_HOURS = '12hrs',
	ONE_DAY = '1d',
}

export interface IRangeMessageLog {
	id: number;
	symbol: string;
	timeInterval: RangeIntervalsEnum;
	foundRange: string;
	diff: string;
	dotsAmount: number;
	time: string;
	isUp?: boolean;
}
