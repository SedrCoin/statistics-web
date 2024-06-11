import { Component } from '@angular/core';
import { Router } from '@angular/router';

export enum MarketTypeEnum {
	SPOT = 'Spot',
	FUTURES = 'Futures'
}

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
	public currentRoute = MarketTypeEnum.SPOT;

	constructor(router: Router) {
	}

	protected readonly MarketTypeEnum = MarketTypeEnum;
}
