import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  isPasswordVisible: boolean = false;
  @Input() isOpen: boolean = false;
  @Output() closeEvent = new EventEmitter<void>();

  close(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.closeEvent.emit();
  }



  get passwordFieldType(): string {
    return this.isPasswordVisible ? 'text' : 'password';
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
