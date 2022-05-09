import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private saveFiltersUrl = 'http://localhost:8180/report-generation-service/reports/filter/save';
  private savedFiltersUrl = 'http://localhost:8180/report-generation-service/reports/filter/saved';

  constructor(private http: HttpClient) { }

  getFilters() {
    return this.http.get(`${this.savedFiltersUrl}`).pipe(
      map((res) => {
        return res;
      }),
      catchError(errorRes => {
        return throwError(errorRes);
      })
    );
  }

  saveFilters(filters: Array<object>) {
    return this.http.post(`${this.saveFiltersUrl}`, filters , { responseType: 'text' });
  }
}
