import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MESSAGES_STORAGE } from '../../models/storage';
import { TableComponent } from '../table/table.component';
import { WsService } from '../../services/ws-service.service';
import { MarketTypeEnum } from '../menu/menu.component';

@Component({
	selector: 'app-futures',
	standalone: true,
	templateUrl: './futures.component.html',

	imports: [
		ReactiveFormsModule,
		TableComponent
	],
	styleUrl: './futures.component.scss'
})
export class FuturesComponent implements OnInit{
	private url: string = 'wss://fstream.binance.com/ws/!ticker@arr'
	public isInfo = false;

	public diffForm: FormGroup;

	public diff: number = 0.1;
	public time: number = 1;

	constructor(
		private ws: WsService,
		private fb: FormBuilder
	) {
	}

	public ngOnInit(): void {
		this.diffForm = this.fb.group({
			diff: ['0.2'],
			time: ['1']
		});

		this.diffForm.valueChanges.subscribe(val => {
			this.diff = val.diff;
			this.time = val.time;
		});
	}

	public startWs(): void {
		this.ws.launchWS(false, this.url, this.diff / 100, this.time);
		this.isInfo = true;
	}

	public stopWs(): void {
		this.ws.stopWS();
	}

	protected readonly MarketTypeEnum = MarketTypeEnum;
	protected readonly MESSAGES_STORAGE = MESSAGES_STORAGE;
}
