import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {SpotComponent} from '../spot/spot.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterLink,
    SpotComponent,
    ModalComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

}
