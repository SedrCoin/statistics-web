import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IWSLog } from '../../models/models';
import { NgClass, NgStyle } from '@angular/common';
import { MarketTypeEnum } from '../../services/page.service';
import { DataService } from '../../services/data.service';

@Component({
	selector: 'app-base-table',
	standalone: true,
	imports: [NgStyle, NgClass],
	templateUrl: './base-table.component.html',
	styleUrl: './base-table.component.scss'
})
export class BaseTableComponent implements OnChanges {
	@Input({ required: true }) public marketType: MarketTypeEnum;
	@Input({ required: true }) public logs: IWSLog[] = [];

	constructor(private db: DataService) {}

	public ngOnChanges(changes: SimpleChanges): void {
		console.log('received new input logs: ', this.logs);
	}

	public deleteRow(log: IWSLog): void {
		const index: number =  this.logs.findIndex((el: IWSLog): boolean => el.id === log.id);
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

	protected readonly parseFloat = parseFloat;
	protected readonly Math = Math;
}
