import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { CountryCode } from '../Modules/country-code';
import { environment } from '../../environments/environment';
import { UniversityInfoInterface } from '../Modules/university-info-interface';

@Injectable({
  providedIn: 'root'
})
export class CountryCodeService {

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

  AllCountries(){
    return this.httpClient.get<CountryCode[]>(`${environment.APIURL}/CountriesInfo`).pipe(
      retry(10),
      catchError(this.handleError)
    )
  }

  GetCountryCode(country:string):Observable<CountryCode[]>{
    return this.httpClient.get<CountryCode[]>(`${environment.APIURL}/CountriesInfo?name=${country}`).pipe(
      retry(10),
      catchError(this.handleError)
    )
  }

  GetCountryUniversities(country:string):Observable<UniversityInfoInterface[]>{
    return this.httpClient.get<UniversityInfoInterface[]>(`${environment.APIURL}/Universities?country=${country}`).pipe(
      retry(10),
      catchError(this.handleError)
    )
  }

}
