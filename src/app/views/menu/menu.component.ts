import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

export enum MarketTypeEnum {
	SPOT = 'Spot',
	FUTURES = 'Futures'
}

@Component({
	selector: 'app-menu',
	standalone: true,
	templateUrl: './menu.component.html',
	imports: [
		RouterLink,
		RouterLinkActive
	],
	styleUrl: './menu.component.scss'
})
export class MenuComponent {
	public currentRoute = MarketTypeEnum.SPOT;

	constructor(router: Router) {
	}

	protected readonly MarketTypeEnum = MarketTypeEnum;
}
