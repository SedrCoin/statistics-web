import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SpotComponent } from '../spot/spot.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
	selector: 'app-welcome',
	standalone: true,
	imports: [
		RouterLink,
		SpotComponent,
		ModalComponent
	],
	templateUrl: './welcome.component.html',
	styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {

	isModalOpen = false;

	openModal() {
		this.isModalOpen = true;
	}

	closeModal() {
		this.isModalOpen = false;
	}

}
