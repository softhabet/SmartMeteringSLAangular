import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable, from, throwError} from 'rxjs';
import { Router } from '@angular/router';

export interface ISignInCredentials {
  email: string;
  password: string;
}

export interface ICreateCredentials {
  email: string;
  password: string;
  userName: string;
}

export interface IPasswordReset {
  code: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private signInUrl = 'http://localhost:8180/authentication-service/login';
  private signUpUrl = 'http://localhost:8180/authentication-service/admins/register';


  constructor(private http: HttpClient, public router: Router, private afAuth: AngularFireAuth) { }

  signIn(credentials: ISignInCredentials) {
    const params = new HttpParams({
      fromObject: { email: credentials.email, password: credentials.password},
    });
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    };
    return this.http.post(`${this.signInUrl}`, params.toString(), httpOptions);
  }

  register(credentials: ICreateCredentials) {
    return this.http.post(`${this.signUpUrl}`, credentials, { responseType: 'text' });
  }

  // signOut() {
  //   return from(this.afAuth.auth.signOut());
  // }

  logOut() {
    const removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['/user']);
    }
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  sendPasswordEmail(email) {
    return from(this.afAuth.auth.sendPasswordResetEmail(email));
  }

  resetPassword(credentials: IPasswordReset) {
    return from(this.afAuth.auth.confirmPasswordReset(credentials.code, credentials.newPassword));
  }

  get user(): firebase.User {
    return this.afAuth.auth.currentUser;
  }

}
