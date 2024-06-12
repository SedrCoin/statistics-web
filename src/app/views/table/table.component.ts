import { Component, Input } from '@angular/core';
import { IWSLog } from '../../models/models';

@Component({
	selector: 'app-table',
	standalone: true,
	templateUrl: './table.component.html',
	styleUrl: './table.component.scss'
})
export class TableComponent {
	@Input() public logs: IWSLog[] = [];

	public getSpotLink(ticker: string): string {
		return 'https://www.binance.com/en/trade/' + ticker + '?type=spot';
	}
}
