import { Injectable } from '@angular/core';
import { IWSMarketDataResponse, MESSAGE_STORAGE, WS_NEW_STORAGE, WSMarketData } from '../models/storage';
import { IWSLOG } from '../models/models';

@Injectable({
	providedIn: 'root'
})
export class WsSpotService {

	public isWsOn = false;
	public diffThreshold: number = 0;
	public timeInterval: number = 0;
	private websocket: WebSocket | null = null;

	private ID = 0;

	public launchWS(diffThreshold: number, time: number): void {
		this.diffThreshold = diffThreshold;
		this.timeInterval = time;

		const url: string = 'wss://stream.binance.com:9443/ws/!ticker@arr';
		this.websocket = new WebSocket(url);

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
		return data.map((el: IWSMarketDataResponse): WSMarketData => new WSMarketData(el.s, el.p, el.P, el.c, el.E));
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
		});
	}//  [1, 2]; time = 2

	public checkForDiff(DiffThreshold: number, time: number): void {

		WS_NEW_STORAGE.forEach((el: WSMarketData[]): void => {
			if (el.length < time + 1) return; // todo check later

			console.log('el: ', el);
			console.log('timeInterval: ', time);

			const lastValue: WSMarketData = el[el.length - 1];
			const preLastValue: WSMarketData = el[el.length - 1 - time];

			const diff: number = ((parseFloat(lastValue.lastPrice) - parseFloat(preLastValue.lastPrice)) / parseFloat(preLastValue.lastPrice));

			if (diff > this.diffThreshold || diff < -this.diffThreshold) {
				const logMessage = `🛎️ ${lastValue.symbol} только что изменился на ${(diff * 100).toFixed(4)}!`;
				const currentTimestamp = Date.now();
				console.log(logMessage);
				const log: IWSLOG = {
					id: this.ID,
					symbol: lastValue.symbol,
					priceChanged: prettifyPercent(diff),
					time: new Date(Date.now()).toLocaleTimeString(),
					diff: prettifyPercent(this.diffThreshold),
					interval: this.timeInterval
				};

				this.ID++;
				MESSAGE_STORAGE.push(log);
			}
		});


	}

}

export function prettifyPercent(num: number): string {
	if (!num) return '';
	return (num * 100).toFixed(2) + ' %';
}


