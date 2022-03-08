import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import reports from 'src/app/mydata/reports';

export interface IReport {
  id: number;
  title: string;
  createdBy: string;
  date: string;
}

export interface IReportResponse {
  data: IReport[];
  totalItem: number;
  totalPage: number;
  pageSize: string;
  currentPage: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) { }

  // getReports(pageSize: number = 10, currentPage: number = 1, search: string = '', orderBy: string = '') {
  //   const url = environment.apiUrl + '/cakes/paging';
  //   let params = new HttpParams();
  //   params = params.append('pageSize', pageSize + '');
  //   params = params.append('currentPage', currentPage + '');
  //   params = params.append('search', search);
  //   params = params.append('orderBy', orderBy);

  //   return this.http.get(url, { params })
  //     .pipe(
  //       map((res: IReportResponse) => {
  //         return res;
  //       }),
  //       catchError(errorRes => {
  //         return throwError(errorRes);
  //       })
  //     );
  // }

  getReports() {
    return reports.slice(0, 20).map(({ title, createdBy, date, id }) => ({ title, createdBy, date, id }));
  }
}
