import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { UserInterface } from '../Modules/user-interface'
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { UserAddCart } from '../Modules/user-add-cart';
import { SavedProductsService } from './saved-products.service';

@Injectable({
  providedIn: 'root'
})
export class UserLoginDataServicesService {
  UserLoggedData: UserInterface | null = null;
  httpOption;
  UsersData: Observable<UserInterface[]>;
  constructor(private httpClient: HttpClient, private router: Router, private SavedProduct:SavedProductsService) {
    this.httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
        // ,Authorization: 'my-auth-token' no need as we don't have authorization token
      })
    };
    this.UsersData = this.httpClient.get<UserInterface[]>(`${environment.APIURL}/users`).pipe(
      retry(10),
      catchError(this.handleError)
    )
  }
  private handleError(error: HttpErrorResponse) {
    // Generic Error handler
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Write error details in Generic error log

    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Error occured, please try again')
    )
  }

  CheckUsernameAndPassword(email: string, Password: string): any {
    let RequestedUserData: Observable<UserInterface[]> | any = this.httpClient.get<UserInterface[]>(`${environment.APIURL}/users?email=${email}`).pipe(
      retry(2),
      catchError(this.handleError)
    );
    RequestedUserData.subscribe((Data: any) => {
      if (Data[0]?.password == Password) {
        this.UserLoggedData = Data[0];
        this.router.navigate(['/']);
        localStorage.setItem('currentUser', JSON.stringify(Data[0]));

        return true;
      } else {
        return false;
      }
    });
  }

  UserLogOut() {
    localStorage.setItem('currentUser', JSON.stringify(null));
  }

  UserSignIn(NewData:UserInterface){
    return this.httpClient.post<UserInterface>(`${environment.APIURL}/users`,NewData,this.httpOption);
  }

}
