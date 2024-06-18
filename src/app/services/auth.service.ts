import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService  {

  private isAuthenticated: boolean = false;


  constructor(private fb: Auth ) {}

  get isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  register(email: string, password: string ): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.fb, email, password).then(
        res => updateProfile(res.user, {displayName: email})
    )

    return from(promise)

  }


  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
        this.fb, email, password

    ).then(() => {
      this.isAuthenticated = true;
    })
    return from(promise)
  }


}
