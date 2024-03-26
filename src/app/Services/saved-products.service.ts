import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { SavedProduct } from '../Modules/saved-product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SavedProductsService {
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
  UpdateSaved(NewProduct: SavedProduct) {
    this.httpClient.patch<SavedProduct>(`${environment.APIURL}/UsersSaved/${NewProduct.id}`, NewProduct, this.httpOption).pipe(catchError(this.handleError)).subscribe((SavedData) => { localStorage.setItem('userSaved', JSON.stringify(SavedData)) });
  }
  GetSavedByUserId(id: String):Observable<SavedProduct> {
    return this.httpClient.get<SavedProduct>(`${environment.APIURL}/UsersSaved/${id}`).pipe(
      retry(10),
      catchError(this.handleError))
  }
  AddNewUserSaves(Accountid:string){
    let UserSaved:SavedProduct = {id:Accountid, Items:[]}
    return this.httpClient.post<SavedProduct>(`${environment.APIURL}/UsersSaved`, UserSaved, this.httpOption).pipe(catchError(this.handleError));
  }
}
