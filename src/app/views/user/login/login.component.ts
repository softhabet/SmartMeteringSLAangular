import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  emailModel = 'demo@vien.com';
  passwordModel = 'demovien1122';

  buttonDisabled = false;
  buttonState = '';

  constructor(private authService: AuthService, private notifications: NotificationsService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    if (!this.loginForm.valid || this.buttonDisabled) {
      return;
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    this.authService.signIn(this.loginForm.value).subscribe((res: any) => {
      localStorage.removeItem('access_token');
      localStorage.setItem('access_token', res.access_token);
      this.router.navigate(['/']);
    }, (error) => {
      localStorage.removeItem('access_token');
      this.buttonDisabled = false;
      this.buttonState = '';
      this.notifications.create('False credentials !', 'Please check your email or password.', NotificationType.Error, { theClass: 'outline primary', timeOut: 4000, showProgressBar: false });
    });
  }
}
