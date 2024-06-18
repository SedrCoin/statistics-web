import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum MarketTypeEnum {
	SPOT = 'Spot',
	FUTURES = 'Futures'
}

@Injectable({ providedIn: 'root' })
export class PageService {
	public currentPage$ = new BehaviorSubject<MarketTypeEnum>(MarketTypeEnum.SPOT);
}
