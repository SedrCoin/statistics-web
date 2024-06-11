import { Component, OnInit } from '@angular/core';
import { WsSpotService } from '../../services/ws-spot.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MESSAGE_STORAGE } from '../../models/storage';

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
	public isInfo = false;

	public diffForm: FormGroup;

	public diff: number = 0;
	public time: number = 0;

	protected readonly MESSAGE_STORAGE = MESSAGE_STORAGE;

	constructor(private ws: WsSpotService, private fb: FormBuilder) {
	}

	public ngOnInit(): void {
		this.diffForm = this.fb.group({
			diff: [''],
			time: ['']
		});

		this.diffForm.valueChanges.subscribe(val => {
			this.diff = val.diff;
			this.time = val.time;
		});
	}

	public startWs(): void {
		this.ws.launchWS(this.diff / 100, this.time);
		this.isInfo = true;
	}

	public stopWs(): void {
		this.ws.stopWS();
	}
}
