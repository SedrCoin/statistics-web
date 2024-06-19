import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,

  ],

  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  isPasswordVisible: boolean = false;

  username: string = '';
  password: string = '';

  isSignIn = true;
  isRegister  = false;

  @Input() isOpen: boolean = false;
  @Output() closeEvent = new EventEmitter<void>();


  constructor(private authService: AuthService, private router: Router) {}


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




  // login(): void {
  //   if (this.authService.login(this.username, this.password)) {
  //     this.close();
  //     this.router.navigate(['/spot']);
  //   } else {
  //     alert('Invalid credentials');
  //   }
  // }



  toggleSignIn(): void {
    this.isSignIn = true;
    this.isRegister = false;
  }

  toggleRegister(): void {
    this.isRegister = true;
    this.isSignIn = false;
  }


  register() {
    this.authService.register(this.username, this.password).subscribe( () => {
          this.router.navigateByUrl('/');
    }

    )
  }

  login() {
    this.authService.login(this.username, this.password).subscribe( () => {
      this.router.navigate(['/main']);
    })
  }


}
