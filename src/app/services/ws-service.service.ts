import { Injectable } from '@angular/core';
import {
	IWSMarketDataResponse,
	MESSAGES_STORAGE,
	PRE_PRICES_MAP,
	PRICES_MAP,
	RANGES_MESSAGES_STORAGE,
	WS_NEW_STORAGE,
	WSMarketData,
} from '../models/storage';
import { IConfigForm, IRangeMessageLog, IWSLog, RangeIntervalsEnum, RANGES_DOTS } from '../models/models';
import { MarketTypeEnum } from './page.service';
import { FilterService } from './filter.service';

@Injectable({
	providedIn: 'root'
})
export class WsService {
	public isWsOn = false;
	public userConfig: IConfigForm;


	private websocket: WebSocket | null = null;
	private marketType: MarketTypeEnum;
	private ID = 0;


	constructor(private f: FilterService) {
	}
	public launchWS(
		isSpot: boolean,
		wsUrl: string,
		formValue: IConfigForm
	): void {
		if (isSpot) {
			this.marketType = MarketTypeEnum.SPOT;
		} else {
			this.marketType = MarketTypeEnum.FUTURES;
		}

		this.userConfig = formValue;

		this.websocket = new WebSocket(wsUrl);

		this.websocket.onopen = (): void => {
			console.debug('Connected to WebSocket server');
			this.isWsOn = true;
		};

		this.websocket.onclose = (): void => {
			console.debug('Disconnected from WebSocket server');
			this.isWsOn = false;
		};

		this.websocket.onmessage = (event: MessageEvent): void => {
			const marketData = JSON.parse(event.data);
			const filteredMarketData: WSMarketData[] = this.filterAndMakeModels(marketData);

			this.updateStorage(filteredMarketData);
			this.checkForDiff();
		};
	}

	public stopWS(): void {
		if (this.websocket) {
			this.websocket.close();
			this.websocket = null;
			this.isWsOn = false;
			console.debug('WebSocket connection closed');
		}
	}


	public filterAndMakeModels(data: IWSMarketDataResponse[]): WSMarketData[] {
		return data
			.map((el: IWSMarketDataResponse): WSMarketData => new WSMarketData(el.s, el.p, el.P, el.c, el.E))
			.filter((el: WSMarketData): boolean => (this.userConfig.whitelist && this.userConfig.whitelist.length > 0) ? this.userConfig.whitelist.includes(el.symbol) : true)
			.filter((el: WSMarketData): boolean => (this.userConfig.blacklist && this.userConfig.blacklist.length > 0) ? !this.userConfig.blacklist.includes(el.symbol) : true)

			.filter((el: WSMarketData): boolean => (this.f.isfiltered) ? el.symbol.endsWith('USDT') : true );
	}

	private fillInStorageForRanges(coinData: WSMarketData): void {
		const currentPrePricesEl: number[] | undefined = PRE_PRICES_MAP.get(coinData.symbol);
		const currentPricesEl: number[] | undefined = PRICES_MAP.get(coinData.symbol);

		// @ts-ignore
		if (currentPricesEl?.length > RANGES_DOTS[this.userConfig.timeInterval]) {

			// have enough base prices => moving to current interval
			if (!currentPrePricesEl) {

				// haven't got any current prices
				PRE_PRICES_MAP.set(coinData.symbol, [parseFloat(coinData.lastPrice)]);
			} else {

				// already have some current prices
				// @ts-ignore
				if (currentPrePricesEl?.length > RANGES_DOTS[RangeIntervalsEnum.FIVE_MINS]) {

					// have required current prices -> clean-up everything, move interval
					if (!currentPrePricesEl || !currentPricesEl) return;
					currentPricesEl?.push(...currentPrePricesEl);
					currentPricesEl.splice(currentPrePricesEl.length, 0);
					PRE_PRICES_MAP.delete(coinData.symbol);

				} else {
					// haven't got enough current prices => just pushing
					currentPrePricesEl?.push(parseFloat(coinData.lastPrice));

					// todo -> very important
					this.detectRangesBreak(coinData);
				}
			}
		} else {

			// haven't got enough base prices => just pushing
			if (currentPricesEl) {
				currentPricesEl?.push(+coinData.lastPrice);
			} else {
				PRICES_MAP.set(coinData.symbol, [+coinData.lastPrice]);
			}
		}
	}

	private detectRangesBreak(coinData: WSMarketData): void {
		const currentPricesEl: number[] | undefined = PRICES_MAP.get(coinData.symbol);
		const currentPrePricesEl: number[] | undefined = PRE_PRICES_MAP.get(coinData.symbol);
		if (!currentPricesEl || !currentPrePricesEl) return;
		if (!this.userConfig.intervalDiff || !this.userConfig.dotsAmount) return;

		const min: number = Math.min(...currentPricesEl);
		const max: number = Math.max(...currentPricesEl);
		const range: number = (max - min) / min;

		if (!range) return;

		// @ts-ignore // no idea wtf is wrong with ide
		const isAboveMax: boolean = currentPrePricesEl.filter((price: number): boolean => price / max -1 > (range * this.userConfig.intervalDiff)).length > this.userConfig.dotsAmount;
		// @ts-ignore  // no idea wtf is wrong with ide
		const isBelowMin: boolean = currentPrePricesEl.filter((price: number): boolean => price / min -1 < (-range * this.userConfig.intervalDiff)).length > this.userConfig.dotsAmount;

		let newLog: IRangeMessageLog;

		if (isAboveMax || isBelowMin) {
			newLog = {
				id: 0,
				symbol: coinData.symbol,
				timeInterval: RangeIntervalsEnum.FIVE_MINS,
				foundRange: '5%',
				diff: '1%',
				dotsAmount: 5,
				time: new Date(Date.now()).toLocaleTimeString()
			};
			newLog.isUp = isAboveMax;
		}

		// @ts-ignore
		if (!newLog) return;
		RANGES_MESSAGES_STORAGE.get(this.marketType)?.push(newLog);
	}

	public updateStorage(filteredMarketData: WSMarketData[]): void {
		filteredMarketData.forEach((el: WSMarketData): void => {
			// ranges calculating logic
			this.fillInStorageForRanges(el);

			if (!WS_NEW_STORAGE.has(el.symbol)) {
				WS_NEW_STORAGE.set(el.symbol, [el]);
			} else {
				WS_NEW_STORAGE.get(el.symbol)?.push(el);

				//@ts-ignore
				if (WS_NEW_STORAGE.get(el.symbol)?.length > 6) {
					WS_NEW_STORAGE.get(el.symbol)?.shift();
				}
			}

		});
	}

	public checkForDiff(): void {
		if (!this.userConfig?.diff || !this.userConfig?.time) return;

		WS_NEW_STORAGE.forEach((el: WSMarketData[]): void => {
			if (!this.userConfig.time) return;

			if (el.length < this.userConfig.time + 1) return; // todo check later

			const lastValue: WSMarketData = el[el.length - 1];
			const preLastValue: WSMarketData = el[el.length - 1 - this.userConfig.time];

			const diff: number = ((parseFloat(lastValue.lastPrice) - parseFloat(preLastValue.lastPrice)) / parseFloat(preLastValue.lastPrice));

			if (!this.userConfig.diff) return;

			if (diff > this.userConfig.diff || diff < -this.userConfig.diff) {
				// const logMessage = `🛎️ ${lastValue.symbol} только что изменился на ${(diff * 100).toFixed(4)}!`;
				const log: IWSLog = {
					id: this.ID,
					symbol: lastValue.symbol,
					priceChanged: prettifyPercent(diff),
					time: new Date(Date.now()).toLocaleTimeString(),
					diff: this.userConfig.diff * 100,
					interval: this.userConfig.time,
					prevPrice: preLastValue.lastPrice,
					curPrice: lastValue.lastPrice
				};

				this.ID++;

				if (this.marketType === MarketTypeEnum.SPOT) {
					const index: undefined | number = MESSAGES_STORAGE.get(MarketTypeEnum.SPOT)?.findIndex((el: IWSLog) => el.symbol === log.symbol && el.diff === log.diff);
					if (index && index > -1) {
						return;
					}
					MESSAGES_STORAGE.get(MarketTypeEnum.SPOT)?.push(log);
				} else {
					const index: undefined | number = MESSAGES_STORAGE.get(MarketTypeEnum.SPOT)?.findIndex((el: IWSLog) => el.symbol === log.symbol && el.diff === log.diff);
					if (index && index > -1) {
						return;
					}
					MESSAGES_STORAGE.get(MarketTypeEnum.FUTURES)?.push(log);
				}
			}
		});
	}
}

export function prettifyPercent(num: number): string {
	if (!num) return '';
	return (num * 100).toFixed(2) + '%';
}

export function prettifyNums(num: string): string {
	if(+num < 1 ) {
		return num + '$';
	} else {
		return num + '$'
	}
}

