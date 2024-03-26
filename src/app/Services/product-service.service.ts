import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { ProductInterface } from '../Modules/product-interface';
import { environment } from '../../environments/environment';
import { Console } from 'console';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  ProductList: Observable<ProductInterface[]>
  CategoryList: string[]
  Product: ProductInterface | null = null;
  httpOption;
  constructor(private httpClient: HttpClient) {
    this.httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'no authorization'
      })
    };
    this.ProductList = this.httpClient.get<ProductInterface[]>(`${environment.APIURL}/products`)
    this.CategoryList = ["smartphones", "laptops", "fragrances", "skincare", "groceries", "home-decoration", "furniture", "tops", "womens-dresses", "womens-shoes", "mens-shirts", "mens-shoes", "mens-watches", "womens-watches", "womens-bags", "womens-jewellery", "sunglasses", "automotive", "motorcycle", "lighting"]
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

  GetAllProduct(): Observable<ProductInterface[]> {
    return this.httpClient.get<ProductInterface[]>(`${environment.APIURL}/products`).pipe(
      retry(10),
      catchError(this.handleError)
    )
  }

  GetProductById(ID: number): Observable<ProductInterface> {
    return this.httpClient.get<ProductInterface>(`${environment.APIURL}/products/${ID}`).pipe(
      retry(10),
      catchError(this.handleError)
    )
  }

  GetProductsByCategory(Category: string): Observable<ProductInterface[]> {
    return this.httpClient.get<ProductInterface[]>(`${environment.APIURL}/products?category=${Category}`).pipe(
      retry(10),
      catchError(this.handleError)
    )
  }

  UpdateProduct(ProductUpdated: ProductInterface) {
    this.httpClient.patch<ProductInterface>(`${environment.APIURL}/products/${ProductUpdated.id}`, ProductUpdated, this.httpOption).pipe().subscribe((data) => { console.log(data)});
   

  }
}
