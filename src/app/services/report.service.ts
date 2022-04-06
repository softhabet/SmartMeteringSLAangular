import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface IReport {
  reportName: string;
  userName: string;
  reportType: string;
  creationDate: string;
  isScheduled: boolean;
  status: string;
}

export interface IReportResponse {
  totalItems: number;
  reportsList: IReport[];
  totalPages: number;
  pageSize: number;
  currentPage: number;
}

export interface Icolumns {
  columnId: number;
  columnName: string;
  fieldName: string;
}


@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportListUrl = 'http://localhost:8180/report-generation-service/reports/info';
  private reportListScheduledUrl = 'http://localhost:8180/report-generation-service/reports/info/scheduled';
  private columnsUrl = 'http://localhost:8180/report-generation-service/report-type/columns';
  private criteriaUrl = 'http://localhost:8180/report-generation-service/report-type/criteria';

  constructor(private http: HttpClient) {  }

  getReports(pageSize: number = 10, currentPage: number = 0, name: string = '', owner: string = '', status: string = '') {
    const url = this.reportListUrl;
    let params = new HttpParams();
    params = params.append('size', pageSize + '');
    params = params.append('page', currentPage + '');
    if (name !== '' && name !== null) {
      params = params.append('name', name);
    }
    if (owner !== '' && owner !== null) {
      params = params.append('owner', owner);
    }
    if (status === 'ACTIVE' || status === 'FINISHED' || status === 'NOT_STARTED') {
      params = params.append('status', status);
    }
    return this.http.get(url, { params })
      .pipe(
        map((res: IReportResponse) => {
          return res;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  getReportsScheduled(pageSize: number = 10, currentPage: number = 0, name: string = '', owner: string = '', scheduled: boolean = true, status: string = '') {
    const url = this.reportListScheduledUrl;
    let params = new HttpParams();
    params = params.append('size', pageSize + '');
    params = params.append('page', currentPage + '');
    if (name !== '' && name !== null) {
      params = params.append('name', name);
    }
    if (owner !== '' && owner !== null) {
      params = params.append('owner', owner);
    }
    if (scheduled !== null) {
      params = params.append('scheduled', scheduled + '');
    }
    if (status === 'ACTIVE' || status === 'FINISHED' || status === 'NOT_STARTED') {
      params = params.append('status', status);
    }
    return this.http.get(url, { params })
      .pipe(
        map((res: IReportResponse) => {
          return res;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  getColumns(id: number) {
    return this.http.get(`${this.columnsUrl}/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(errorRes => {
        return throwError(errorRes);
      })
    );
  }

  getCriteriaSet(id: number) {
    return this.http.get(`${this.criteriaUrl}/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(errorRes => {
        return throwError(errorRes);
      })
    );
  }


}
