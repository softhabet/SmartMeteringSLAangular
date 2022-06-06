import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  @ViewChild('registerForm') registerForm: NgForm;
  buttonDisabled = false;
  buttonState = '';

  constructor(private authService: AuthService, private notifications: NotificationsService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    if (!this.registerForm.valid || this.buttonDisabled) {
      return;
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    this.authService.register(this.registerForm.value).subscribe(() => {
      this.notifications.create('Success', 'Account registered', NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: true });
      setTimeout(() => {
        this.router.navigate(['/']);
    }, 3000);
    }, (error) => {
      if (error.error === 'USERNAME EXISTS') {
        this.notifications.create('UserName exists !', 'Choose another userName.', NotificationType.Warn, { theClass: 'outline primary', timeOut: 4000, showProgressBar: false });
      } else if ('EMAIL EXISTS') {
        this.notifications.create('Email exists !', 'Choose another Email.', NotificationType.Warn, { theClass: 'outline primary', timeOut: 4000, showProgressBar: false });
      } else {
        this.notifications.create('Error', 'Error', NotificationType.Error, { theClass: 'outline primary', timeOut: 4000, showProgressBar: false });
      }
      this.buttonDisabled = false;
      this.buttonState = '';
    });
  }
}
