import { Component, Input } from '@angular/core';
import { IRangeMessageLog } from '../../models/models';
import { MarketTypeEnum } from '../../services/page.service';

@Component({
	selector: 'app-ranges-table',
	standalone: true,
	templateUrl: './ranges-table.component.html',
	styleUrl: './ranges-table.component.scss'
})
export class RangesTableComponent {
	@Input({ required: true }) public marketType: MarketTypeEnum;
	@Input({ required: true }) public logs: IRangeMessageLog[] = [];

	public deleteRow(log: IRangeMessageLog): void {
		const index: number =  this.logs.findIndex((el: IRangeMessageLog): boolean => el.id === log.id);
		if (index > -1) {
			this.logs.splice(index, 1)
		}
	}

	public getLink(ticker: string): string {
		if (this.marketType === MarketTypeEnum.SPOT) {
			return 'https://www.binance.com/en/trade/' + ticker + '?type=spot';
		} else {
			return 'https://www.binance.com/en/futures/' + ticker;
		}
	}
}
