import { Component, HostListener, OnInit } from '@angular/core';
import { IConfigForm, RangeIntervalsEnum, WS_URLS } from '../../models/models';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WsService } from '../../services/ws-service.service';
import { BinanceService } from '../../services/api.service';
import { MESSAGES_STORAGE, RANGES_MESSAGES_STORAGE } from '../../models/storage';
import { ConfigPagesEnum } from '../spot/spot.component';
import { BaseTableComponent } from '../base-table/base-table.component';
import { NgClass } from '@angular/common';
import { RangesTableComponent } from '../ranges-table/ranges-table.component';
import { MarketTypeEnum, PageService } from 'src/app/services/page.service';

@Component({
	selector: 'app-base-view',
	standalone: true,
	imports: [
		BaseTableComponent,
		FormsModule,
		ReactiveFormsModule,
		NgClass,
		RangesTableComponent
	],
	templateUrl: './base-view.component.html',
	styleUrl: './base-view.component.scss'
})
export class BaseViewComponent implements OnInit {
	@HostListener('document:click', ['$event'])
	public closeDropdown(event: Event): void {
		this.showList = false;
	}

	public currentPage = ConfigPagesEnum.DIFF;
	public isShowInfo = false;

	public userConfig: IConfigForm = {
		diff: 0.002,
		time: 1,

		timeInterval: RangeIntervalsEnum.ONE_MINUTE,
		intervalDiff: 0.001,
		dotsAmount: 1,

		whitelist: [],
		blacklist: []
	};

	//dropdown
	public allPairs: string[] = [];
	public filteredPairs: string[] = [];
	public selectedPairs: string[] = [];
	public showList = false;

	public blacklist: string = '';
	public whitelist: string = '';

	private wsUrl: string;
	private currentSection: MarketTypeEnum;

	public form = this.fb.group({
		diff: [0.2, [Validators.required, Validators.min(1), Validators.max(100)]],
		time: [1, [Validators.required, Validators.min(1), Validators.max(100)]],

		pair: [''],

		timeInterval: ['1min'],
		intervalDiff: [0.02],
		dotsAmount: [1],

		whitelist: [''],
		blacklist: [''],
	});

	constructor(
		private ws: WsService,
		private fb: FormBuilder,
		private binanceService: BinanceService,
		private pageService: PageService
	) {
		this.pageService.currentPage$
			.subscribe((section: MarketTypeEnum): void => {
				this.currentSection = section;
				this.wsUrl = WS_URLS[section];
			});
	}

	public ngOnInit(): void {

		this.form.valueChanges.subscribe((formValue): void => {
			this.userConfig = {
				diff: formValue.diff ? formValue.diff / 100 : null,
				time: formValue.time ?? null,

				// todo -> hardcode here
				timeInterval: RangeIntervalsEnum.ONE_MINUTE ?? null,
				intervalDiff: formValue.intervalDiff ? formValue.intervalDiff / 100 : null,
				dotsAmount: formValue.dotsAmount ?? null,

				whitelist: formValue.whitelist ? formValue.whitelist.split(',') : null,
				blacklist: formValue.blacklist ? formValue.blacklist.split(',') : null,
			};
		});

		this.loadPairs();
	}

	public startWs(): void {
		this.ws.launchWS(this.currentSection === MarketTypeEnum.SPOT, this.wsUrl, this.userConfig);
		this.isShowInfo = true;
	}

	public stopWs(): void {
		this.ws.stopWS();
	}

	public onChangePage(page: ConfigPagesEnum): void {
		this.currentPage = page;
	}

	public applyBLWL(): void {
		this.userConfig.whitelist = [...this.selectedPairs];
	}

	// dropDown func
	public loadPairs(): void {
		this.binanceService.getPairs()
			.subscribe((data: any): void => {
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
			this.form.get('pair')?.setValue('');
			this.filteredPairs = [...this.allPairs];
			this.showList = false;
			this.form.get('whitelist')?.reset();
		}
	}

	public removePair(pair: string): void {
		if (!this.userConfig.whitelist) return;

		this.selectedPairs = this.selectedPairs.filter((p: string): boolean => p !== pair);

		const index = this.userConfig.whitelist.findIndex((el: string): boolean => el === pair);
		if (index > -1) {
			this.userConfig.whitelist.splice(index, 1);
		}
	}

	public showDropdown(): void {
		this.showList = true;
	}

	//close dropdown on click outside
	public stopPropagation(event: Event): void {
		event.stopPropagation();
	}

	protected readonly MESSAGES_STORAGE = MESSAGES_STORAGE;
	protected readonly RANGES_MESSAGES_STORAGE = RANGES_MESSAGES_STORAGE;
	protected readonly configPagesEnum = ConfigPagesEnum;
	protected readonly MarketTypeEnum = MarketTypeEnum;
}