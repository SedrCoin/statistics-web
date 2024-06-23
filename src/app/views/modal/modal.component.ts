import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
	selector: 'app-modal',
	standalone: true,
	imports: [
		RouterLink,
		FormsModule,
		NgClass,
	],
	templateUrl: './modal.component.html',
	styleUrl: './modal.component.scss'
})
export class ModalComponent {
	@Input() isOpen: boolean = false;
	@Output() closeEvent = new EventEmitter<void>();

	public isPasswordVisible: boolean = false;

	public username: string = '';
	public password: string = '';

	public isSignIn = true;
	public isRegister = false;

	constructor(
		private authService: AuthService,
		private router: Router
	) {
	}

	public close(event?: MouseEvent): void {
		if (event) {
			event.stopPropagation();
		}
		this.closeEvent.emit();
	}

	public get passwordFieldType(): string {
		return this.isPasswordVisible ? 'text' : 'password';
	}

	public togglePasswordVisibility(): void {
		this.isPasswordVisible = !this.isPasswordVisible;
	}

	// login(): void {
	//   if (this.authService.login(this.username, this.password)) {
	//     this.close();
	//     this.router.navigate(['/spot']);
	//   } else {
	//     alert('Invalid credentials');
	//   }
	// }

	public toggleSignIn(): void {
		this.isSignIn = true;
		this.isRegister = false;
	}

	public toggleRegister(): void {
		this.isRegister = true;
		this.isSignIn = false;
	}

	public register(): void {
		this.authService.register(this.username, this.password).subscribe((): void => {
				this.router.navigateByUrl('/');
			}
		);
	}

	public login(): void {
		this.authService.login(this.username, this.password).subscribe((): void => {
			this.router.navigate(['/main']);
		});
	}
}
