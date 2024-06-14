import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BLACK_LIST, MESSAGES_STORAGE, WHITE_LIST } from '../../models/storage';
import { TableComponent } from '../table/table.component';
import { WsService } from '../../services/ws-service.service';
import { NgClass } from '@angular/common';
import { MarketTypeEnum } from '../menu/menu.component';
import { BinanceService } from '../../services/api.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { config } from 'rxjs';

export enum ConfigPagesEnum {
	DIFF = 'diff',
	WLBL = 'wlbl',
	RANGES = 'ranges'
}

@Component({
	selector: 'app-spot',
	standalone: true,
	templateUrl: './spot.component.html',
	imports: [
		ReactiveFormsModule,
		TableComponent,
		NgClass,
		RouterLinkActive,
		RouterLink
	],
	styleUrl: './spot.component.scss'
})
export class SpotComponent implements OnInit {

	public currentPage = ConfigPagesEnum.DIFF;
	public configPagesEnum = ConfigPagesEnum;

	//dropdown

	allPairs: string[] = [];
	filteredPairs: string[] = [];
	selectedPairs: string[] = [];
	showList: boolean = false;

	bl: string = '';
	wl:string = '';

	private url: string = 'wss://stream.binance.com:9443/ws/!ticker@arr';
	public isInfo = false;

	public diffForm: FormGroup;

	public diff: number = 0.1;
	public time: number = 1;

	constructor(private ws: WsService, private fb: FormBuilder, private binanceService: BinanceService) {
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
		this.ws.launchWS(true, this.url, this.diff / 100, this.time);
		this.isInfo = true;
	}

	public stopWs(): void {
		this.ws.stopWS();
	}

	public onChangePage(page: ConfigPagesEnum): void {
		this.currentPage = page;
	}

	applyBLWL(): void {
		console.log('blacklist: ' + this.bl)
		console.log('whitelist: ' + this.wl)
		WHITE_LIST.push(...this.selectedPairs);

	}

	protected readonly MESSAGES_STORAGE = MESSAGES_STORAGE;
	protected readonly MarketTypeEnum = MarketTypeEnum;



	// dropDown func

	loadPairs() {
		this.binanceService.getPairs().subscribe((data: any) => {
			this.allPairs = data.map((pair: { symbol: any; }) => pair.symbol).sort();
			this.filteredPairs = [...this.allPairs];
		});

	}

	filterPairs(query: string) {
		this.filteredPairs = this.allPairs.filter(pair => pair.toLowerCase().includes(query.toLowerCase()));
	}

	onPairChange(event: Event) {
		const input = event.target as HTMLInputElement;
		this.filterPairs(input.value);
	}

	selectPair(pair: string) {
		if (!this.selectedPairs.includes(pair)) {
			this.selectedPairs.push(pair);
			this.diffForm.get('pair')?.setValue('');
			this.filteredPairs = [...this.allPairs];
			this.showList = false;
			this.diffForm.get('wl')?.reset()
		}
	}

	removePair(pair: string) {
		this.selectedPairs = this.selectedPairs.filter(p => p !== pair);
		const index = WHITE_LIST.indexOf(pair)
		WHITE_LIST.splice(index, 1)

	}

	showDropdown() {
		this.showList = true;
	}



	//close dropdown on click outside
	stopPropagation(event: Event) {
		event.stopPropagation();
	}

	@HostListener('document:click', ['$event'])
	closeDropdown(event: Event) {
		this.showList = false;
	}

	protected readonly config = config;
}


