import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { UserAddCart } from '../Modules/user-add-cart';
import { environment } from '../../environments/environment';
import { Observable, catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartBoughtProductsService {

  httpOption;
  constructor(private httpClient: HttpClient) {
    this.httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'no authorization'
      })
    };
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

  AddCart(UserProductsList: UserAddCart | null, ProductID: number, Amount: number) {
    if (UserProductsList != null) {
      let ProdIndx = UserProductsList.ItemsInCart.findIndex(item => item.Id === ProductID);
      if (ProdIndx != -1) {
        UserProductsList.ItemsInCart[ProdIndx].Count += Amount;
      } else {
        UserProductsList.ItemsInCart.push({ Id: ProductID, Count: Amount });
      }
    }
    this.UpdateCartProductInApi(UserProductsList!);
  }
  UpdateCartProductInApi(NewCart: UserAddCart) {
    this.httpClient.patch<UserAddCart>(`${environment.APIURL}/UsersProduct/${NewCart?.id}`, NewCart, this.httpOption).pipe().subscribe(() => {});
  }
  GetCartItemsByID(id:String):Observable<UserAddCart>{
    return this.httpClient.get<UserAddCart>(`${environment.APIURL}/UsersProduct/${id}`).pipe(
      retry(10),
      catchError(this.handleError)
    )
  }
  AddNewUserCart(Accountid:string){
    let UserCart:UserAddCart = {id:Accountid, ItemsInCart:[]}
    return this.httpClient.post<UserAddCart>(`${environment.APIURL}/UsersProduct`, UserCart, this.httpOption).pipe(catchError(this.handleError));
  }
}



