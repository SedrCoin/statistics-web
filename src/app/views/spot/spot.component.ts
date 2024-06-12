import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MESSAGES_STORAGE } from '../../models/storage';
import { TableComponent } from '../table/table.component';
import { WsService } from '../../services/ws-service.service';
import { NgClass } from '@angular/common';
import { MarketTypeEnum } from '../menu/menu.component';


@Component({
	selector: 'app-spot',
	standalone: true,
	templateUrl: './spot.component.html',
	imports: [
		ReactiveFormsModule,
		TableComponent,
		NgClass
	],
	styleUrl: './spot.component.scss'
})
export class SpotComponent implements OnInit {

	private url: string = 'wss://stream.binance.com:9443/ws/!ticker@arr';
	public isInfo = false;

	public diffForm: FormGroup;

	public diff: number = 0.1;
	public time: number = 1;

	constructor(private ws: WsService, private fb: FormBuilder) {
	}

	public ngOnInit(): void {
		this.diffForm = this.fb.group({
			diff: ['0.2', [Validators.required, Validators.min(1), Validators.max(100)]],
			time: ['1', [Validators.required, Validators.min(1), Validators.max(100)]]
		});

		this.diffForm.valueChanges.subscribe(val => {
			this.diff = val.diff;
			this.time = val.time;
		});
	}

	public startWs(): void {
		this.ws.launchWS(true, this.url, this.diff / 100, this.time);
		this.isInfo = true;
	}

	public stopWs(): void {
		this.ws.stopWS();
	}

	protected readonly MESSAGES_STORAGE = MESSAGES_STORAGE;
	protected readonly MarketTypeEnum = MarketTypeEnum;
}
