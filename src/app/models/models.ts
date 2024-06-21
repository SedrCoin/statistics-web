import { MarketTypeEnum } from '../services/page.service';

export const WS_URLS: Record<MarketTypeEnum, string> = {
	[MarketTypeEnum.SPOT]: 'wss://stream.binance.com:9443/ws/!ticker@arr',
	[MarketTypeEnum.FUTURES]: 'wss://fstream.binance.com/ws/!ticker@arr',
}

export interface IConfigForm {
	diff?: number | null;
	time?: number | null;

	timeInterval?: RangeIntervalsEnum | null;
	intervalDiff?: number | null;
	dotsAmount?: number | null;

	whitelist?: string[] | null;
	blacklist?: string[] | null;
}

export interface IWSLog {
	id: number;
	symbol: string;
	priceChanged: string;
	time: string;
	diff: number;
	interval: number;
	prevPrice: string;
	curPrice: string;

}

export enum RangeIntervalsEnum {
	ONE_MINUTE = '1min',
	FIVE_MINS = '5min',
	FIFTEEN_MINS = '15min',
	THIRTY_MINS = '30min',
	ONE_HOUR = '1hr',
	SIX_HOURS = '6hrs',
	TWELVE_HOURS = '12hrs',
	ONE_DAY = '1d',
}

export const RANGES_DOTS: Record<RangeIntervalsEnum, number> = {
	[RangeIntervalsEnum.ONE_MINUTE]: 60,
	[RangeIntervalsEnum.FIVE_MINS]: 300,
	[RangeIntervalsEnum.FIFTEEN_MINS]: 900,
	[RangeIntervalsEnum.THIRTY_MINS]: 1800,
	[RangeIntervalsEnum.ONE_HOUR]: 3600,
	[RangeIntervalsEnum.SIX_HOURS]: 21600,
	[RangeIntervalsEnum.TWELVE_HOURS]: 43200,
	[RangeIntervalsEnum.ONE_DAY]: 86400,
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
