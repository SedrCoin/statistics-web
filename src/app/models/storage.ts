import { MarketTypeEnum } from '../views/menu/menu.component';
import { IWSLog } from './models';

export interface IWSMarketDataResponse {
	s: string;
	p: string;
	P: string;
	c: string;
	E: string;
}

export interface ICoinMarketData {
	symbol: string;
	priceChange: string;
	priceChangePercent: string;
	lastPrice: string;
	volume?: string;
	timestamp: string;
}

export class WSMarketData implements ICoinMarketData {
	constructor(
		private s: string,
		private p: string,
		private P: string,
		private c: string,
		private E: string,
	) {
	}

	public get symbol(): string {
		return this.s;
	}

	public get priceChange(): string {
		return this.p;
	}

	public get priceChangePercent(): string {
		return this.P;
	}

	public get lastPrice(): string {
		return this.c;
	}

	public get timestamp(): string {
		return this.E;
	}
}

export let WS_NEW_STORAGE: Map<string, WSMarketData[]> = new Map();

export const MESSAGES_STORAGE: Map<MarketTypeEnum, IWSLog[]> = new Map();
MESSAGES_STORAGE.set(MarketTypeEnum.SPOT, []);
MESSAGES_STORAGE.set(MarketTypeEnum.FUTURES, []);

export let BLACK_LIST: string[] = [];
export const WHITE_LIST: string[] = [];
