import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserLoginDataServicesService } from '../../Services/user-login-data-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class LoginComponent {
  Login = new FormControl();
  constructor(private LoginServices: UserLoginDataServicesService,
    private router:Router) {

  }
  LoginClicked(email: string, password: string) {
    this.LoginServices.CheckUsernameAndPassword(email, password)
  }
}
