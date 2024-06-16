import { Injectable } from '@angular/core';
import {
	IWSMarketDataResponse,
	MESSAGES_STORAGE,
	PRE_PRICES_MAP,
	PRICES_MAP,
	RANGES_MESSAGES_STORAGE,
	WS_NEW_STORAGE,
	WSMarketData,
	BLACK_LIST,
	WHITE_LIST
} from '../models/storage';
import { IRangeMessageLog, IWSLog, RangeIntervalsEnum } from '../models/models';
import { MarketTypeEnum } from '../views/menu/menu.component';

@Injectable({
	providedIn: 'root'
})
export class WsService {

	public isWsOn = false;

	// base diff config
	public diffThreshold = 0;
	public timeInterval = 0;

	// ranges config
	public rangeInterval: RangeIntervalsEnum;
	public rangeDots = 0;
	public rangeRequiredDiff = 0;

	private websocket: WebSocket | null = null;
	private marketType: MarketTypeEnum;

	private ID = 0;

	public launchWS(
		isSpot: boolean,
		wsUrl: string,
		diffThreshold: number,
		time: number
	): void {
		if (isSpot) {
			this.marketType = MarketTypeEnum.SPOT;
		} else {
			this.marketType = MarketTypeEnum.FUTURES;
		}

		this.diffThreshold = diffThreshold;
		this.timeInterval = time;

		this.websocket = new WebSocket(wsUrl);

		this.websocket.onopen = () => {
			console.debug('Connected to WebSocket server');
			this.isWsOn = true;
		};

		this.websocket.onclose = () => {
			console.debug('Disconnected from WebSocket server');
			this.isWsOn = false;
		};

		this.websocket.onmessage = (event: MessageEvent): void => {
			const marketData = JSON.parse(event.data);
			const filteredMarketData = this.filterAndMakeModels(marketData);

			this.updateStorage(filteredMarketData);
			this.checkForDiff(this.diffThreshold, this.timeInterval);
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

		console.log(WHITE_LIST)
		return data
			.map((el: IWSMarketDataResponse): WSMarketData => new WSMarketData(el.s, el.p, el.P, el.c, el.E))
			.filter(el =>  {

				console.log(el.symbol)
				if(WHITE_LIST.length > 0) {
					return WHITE_LIST.includes(el.symbol)
				}

				return true
			})


	}

	private fillInStorageForRanges(coinData: WSMarketData): void {
		const currentPrePricesEl: number[] | undefined = PRE_PRICES_MAP.get(coinData.symbol);
		const currentPricesEl: number[] | undefined = PRICES_MAP.get(coinData.symbol);

		// @ts-ignore
		if (currentPricesEl?.length > 21600) {

			// have enough base prices => moving to current interval
			if (!currentPrePricesEl) {

				// haven't got any current prices
				PRE_PRICES_MAP.set(coinData.symbol, [parseFloat(coinData.lastPrice)]);
				this.detectRangesBreak(coinData);
			} else {

				// already have some current prices
				// @ts-ignore
				if (currentPrePricesEl?.length > 900) {

					// have required current prices -> clean-up everything, move interval
					if (!currentPrePricesEl || !currentPricesEl) return;
					currentPricesEl?.push(...currentPrePricesEl);
					currentPricesEl.splice(currentPrePricesEl.length, 0);
					PRE_PRICES_MAP.delete(coinData.symbol);

				} else {

					// haven't got enough current prices => just pushing
					currentPrePricesEl?.push(parseFloat(coinData.lastPrice));
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

		const min: number = Math.min(...currentPricesEl);
		const max: number = Math.max(...currentPricesEl);
		const range: number = (max - min) / min;

		if (!range) return;

		// todo - add required inputs!
		const isAboveMax: boolean = currentPrePricesEl.filter((price: number): boolean => price / max -1 > (range * 0.05)).length > 3;
		const isBelowMin: boolean = currentPrePricesEl.filter((price: number): boolean => price / min -1 < (-range * 0.05)).length > 3;

		let newLog: IRangeMessageLog;

		if (isAboveMax || isBelowMin) {
			newLog = {
				id: 0,
				symbol: coinData.symbol,
				timeInterval: RangeIntervalsEnum.SIX_HOUR,
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
			if (!WS_NEW_STORAGE.has(el.symbol)) {
				WS_NEW_STORAGE.set(el.symbol, [el]);
			} else {
				WS_NEW_STORAGE.get(el.symbol)?.push(el);

				//@ts-ignore
				if (WS_NEW_STORAGE.get(el.symbol)?.length > 6) {
					WS_NEW_STORAGE.get(el.symbol)?.shift();
				}
			}

			// ranges calculating logic
			this.fillInStorageForRanges(el);
		});
	}

	public checkForDiff(DiffThreshold: number, time: number): void {

		WS_NEW_STORAGE.forEach((el: WSMarketData[]): void => {
			if (el.length < time + 1) return; // todo check later

			const lastValue: WSMarketData = el[el.length - 1];
			const preLastValue: WSMarketData = el[el.length - 1 - time];

			const diff: number = ((parseFloat(lastValue.lastPrice) - parseFloat(preLastValue.lastPrice)) / parseFloat(preLastValue.lastPrice));

			if (diff > this.diffThreshold || diff < -this.diffThreshold) {
				const logMessage = `🛎️ ${lastValue.symbol} только что изменился на ${(diff * 100).toFixed(4)}!`;
				console.log(logMessage);
				const log: IWSLog = {

					id: this.ID,
					symbol: lastValue.symbol,
					priceChanged: prettifyPercent(diff),
					time: new Date(Date.now()).toLocaleTimeString(),
					diff: prettifyPercent(this.diffThreshold),
					interval: this.timeInterval
				};

				this.ID++;

				if (this.marketType === MarketTypeEnum.SPOT) {
					MESSAGES_STORAGE.get(MarketTypeEnum.SPOT)?.push(log);
				} else {
					MESSAGES_STORAGE.get(MarketTypeEnum.FUTURES)?.push(log);
				}
			}
		});
	}
}

export function prettifyPercent(num: number): string {
	if (!num) return '';
	return (num * 100).toFixed(2) + ' %';
}


