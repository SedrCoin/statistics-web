import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MESSAGES_STORAGE, RANGES_MESSAGES_STORAGE } from '../../models/storage';
import { BaseTableComponent } from '../base-table/base-table.component';
import { WsService } from '../../services/ws-service.service';
import { IConfigForm, RangeIntervalsEnum } from '../../models/models';
import { RangesTableComponent } from '../ranges-table/ranges-table.component';
import { ConfigPagesEnum } from '../spot/spot.component';
import { NgClass } from '@angular/common';
import { MarketTypeEnum } from '../../services/page.service';

@Component({
	selector: 'app-futures',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		BaseTableComponent,
		RangesTableComponent,
		NgClass
	],
	templateUrl: './futures.component.html',
	styleUrl: './futures.component.scss'
})
export class FuturesComponent implements OnInit{
	private url: string = 'wss://fstream.binance.com/ws/!ticker@arr';
	public currentPage = ConfigPagesEnum.DIFF;
	public configPagesEnum = ConfigPagesEnum;

	public isInfo = false;
	public diffForm: FormGroup;

	public formValue: IConfigForm = {
		diff: 0.5,
		time: 1,
		timeInterval: RangeIntervalsEnum.ONE_MINUTE,
		intervalDiff: 0.001,
		dotsAmount: 1
	};

	constructor(
		private ws: WsService,
		private fb: FormBuilder
	) {
	}

	public ngOnInit(): void {
		this.diffForm = this.fb.group({
			diff: ['0.5'],
			time: ['1'],

			timeInterval: ['1min'],
			intervalDiff: ['0.1'],
			dotsAmount: ['1']
		});

		this.diffForm.valueChanges.subscribe((val): void => {
			this.formValue = { ...val };

			// this.formValue.diff = this.formValue.diff / 100;
			// this.formValue.intervalDiff = this.formValue.intervalDiff / 100;
		});
	}

	public startWs(): void {
		this.ws.launchWS(false, this.url, this.formValue);
		this.isInfo = true;
	}

	public stopWs(): void {
		this.ws.stopWS();
	}

	public onChangePage(page: ConfigPagesEnum): void {
		this.currentPage = page;
	}

	protected readonly MESSAGES_STORAGE = MESSAGES_STORAGE;
	protected readonly RANGES_MESSAGES_STORAGE = RANGES_MESSAGES_STORAGE;
	protected readonly MarketTypeEnum = MarketTypeEnum;
}
