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
	isInfo = false;

	diffForm: FormGroup;

	diff: number = 0;
	time: number = 0;
	protected readonly MESSAGE_STORAGE = MESSAGE_STORAGE;

	constructor(private ws: WsSpotService, private fb: FormBuilder) {
	}

	ngOnInit() {

		this.diffForm = this.fb.group({
			diff: [''],
			time: ['']
		});


		this.diffForm.valueChanges.subscribe(val => {
			this.diff = val.diff;
			this.time = val.time;

			console.log('Diff:', this.diff, 'Time:', this.time);
		});
	}

	public startWs() {
		this.ws.launchWS(this.diff / 100, this.time);
		this.isInfo = true;
	}

	public stopWs() {
		this.ws.stopWS();
	}
}
