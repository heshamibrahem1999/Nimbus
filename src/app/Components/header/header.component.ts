import { Component } from '@angular/core';
import { UserLoginDataServicesService } from '../../Services/user-login-data-services.service';
import { UserInterface } from '../../Modules/user-interface';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  User: UserInterface|null;
  constructor(private UserData:UserLoginDataServicesService,
    private Router:Router){
    this.User = JSON.parse(localStorage.getItem('currentUser')!);
  }
  Logout(){
    this.UserData.UserLogOut();
    this.Router.navigate(['/']).then(()=>window.location.reload());
  }
}
