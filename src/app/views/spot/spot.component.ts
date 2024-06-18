import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MESSAGES_STORAGE } from '../../models/storage';
import { WsService } from '../../services/ws-service.service';
import { NgClass } from '@angular/common';
import { BinanceService } from '../../services/api.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BaseTableComponent } from '../base-table/base-table.component';
import { config } from 'rxjs';
import { IConfigForm, RangeIntervalsEnum } from '../../models/models';
import { MarketTypeEnum } from 'src/app/services/page.service';

export enum ConfigPagesEnum {
	DIFF = 'diff',
	WLBL = 'wlbl',
	RANGES = 'ranges'
}

@Component({
	selector: 'app-spot',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		BaseTableComponent,
		NgClass,
		RouterLinkActive,
		RouterLink,
		BaseTableComponent
	],
	templateUrl: './spot.component.html',
	styleUrl: './spot.component.scss'
})
export class SpotComponent implements OnInit {
	private url: string = 'wss://stream.binance.com:9443/ws/!ticker@arr';
	public currentPage = ConfigPagesEnum.DIFF;
	public configPagesEnum = ConfigPagesEnum;

	public formValue: IConfigForm = {
		diff: 0.5,
		time: 1,
		timeInterval: RangeIntervalsEnum.ONE_MINUTE,
		intervalDiff: 0.001,
		dotsAmount: 1
	};

	//dropdown
	public allPairs: string[] = [];
	public filteredPairs: string[] = [];
	public selectedPairs: string[] = [];
	public showList: boolean = false;

	public blacklist: string = '';
	public whitelist: string = '';

	public isInfo = false;

	public diffForm: FormGroup;

	public diff: number = 0.1;
	public time: number = 1;

	constructor(
		private ws: WsService,
		private fb: FormBuilder,
		private binanceService: BinanceService
	) {
	}

	public ngOnInit(): void {
		this.diffForm = this.fb.group({
			diff: ['0.2', [Validators.required, Validators.min(1), Validators.max(100)]],
			time: ['1', [Validators.required, Validators.min(1), Validators.max(100)]],
			pair: [''],
			wl: [''],
			config: ['']
		});

		this.loadPairs();
	}

	public startWs(): void {
		this.ws.launchWS(true, this.url, this.formValue);
		this.isInfo = true;
	}

	public stopWs(): void {
		this.ws.stopWS();
	}

	public onChangePage(page: ConfigPagesEnum): void {
		this.currentPage = page;
	}

	public applyBLWL(): void {
		// WHITE_LIST.push(...this.selectedPairs);
	}

	// dropDown func

	public loadPairs() {
		this.binanceService.getPairs().subscribe((data: any) => {
			this.allPairs = data.map((pair: { symbol: any; }) => pair.symbol).sort();
			this.filteredPairs = [...this.allPairs];
		});

	}

	public filterPairs(query: string): void {
		this.filteredPairs = this.allPairs.filter((pair: string) => pair.toLowerCase().includes(query.toLowerCase()));
	}

	public onPairChange(event: Event): void {
		const input = event.target as HTMLInputElement;
		this.filterPairs(input.value);
	}

	public selectPair(pair: string): void {
		if (!this.selectedPairs.includes(pair)) {
			this.selectedPairs.push(pair);
			this.diffForm.get('pair')?.setValue('');
			this.filteredPairs = [...this.allPairs];
			this.showList = false;
			this.diffForm.get('wl')?.reset();
		}
	}

	public removePair(pair: string): void {
		this.selectedPairs = this.selectedPairs.filter((p: string): boolean => p !== pair);
		// const index = WHITE_LIST.findIndex((el: string): boolean => el === pair);
		// if (index > -1) {
		// 	WHITE_LIST.splice(index, 1);
		// }
	}

	public showDropdown(): void {
		this.showList = true;
	}

	//close dropdown on click outside
	public stopPropagation(event: Event): void {
		event.stopPropagation();
	}

	@HostListener('document:click', ['$event'])
	public closeDropdown(event: Event): void {
		this.showList = false;
	}

	protected readonly config = config;
	protected readonly MESSAGES_STORAGE = MESSAGES_STORAGE;
	protected readonly MarketTypeEnum = MarketTypeEnum;
}
